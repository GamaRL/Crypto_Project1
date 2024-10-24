"use client"

import { exportPublicKey, importPublicKey, SignAndEncryptKeyCollection } from "@/services/keyExtractionService";
import { decryptSecret } from "@/services/encryptionService";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import io from "socket.io-client";
import { fromPEM, toPEM } from "@/services/utilities";

interface Credentials {
  username: string,
  keys: SignAndEncryptKeyCollection | null
}

interface AppContextType {
  credentials: Credentials,
  setCredentials: Dispatch<SetStateAction<Credentials>>,
  connectedUsers: ConnectedUser[],
  setConnectedUsers: Dispatch<SetStateAction<ConnectedUser[]>>,
  socket: SocketIOClient.Socket | null,
  cryptoKeys: Object,
  sessionKeys: Object
  setSessionKeys: Dispatch<SetStateAction<Object>>,
}

interface ConnectedUser {
  username: string,
  sessionId: string
}

export const AppContext = createContext<AppContextType>({
  credentials: {
    username: '',
    keys: null,
  },
  setCredentials: () => { },
  connectedUsers: [],
  setConnectedUsers: () => { },
  socket: null,
  cryptoKeys: {},
  sessionKeys: {},
  setSessionKeys: () => { },
})

const AppContextProvider = (props: any) => {
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [cryptoKeys, setCryptoKeys] = useState<Object>({});
  const [sessionKeys, setSessionKeys] = useState<Object>({});
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  const [credentials, setCredentials] = useState<Credentials>({
    username: '',
    keys: null,
  });

  useEffect(() => {

    const SOCKET_BASE_URL = 'http://127.0.0.1:8086/'

    if (credentials.username === '')
      return

    const s = io.connect(SOCKET_BASE_URL, {
      reconnection: true,
      transports: ["websocket", "polling"],
      query: {
        username: credentials.username
      }
    });
    setSocket(s);

    s.on("connect", () => {
      console.log("connected")

      s.emit('show_connections', {}, (response: { username: string, sessionId: string }[]) => {
        console.log(response)
        setConnectedUsers(response)
      })

      s.on("add_user", (user: { username: string, sessionId: string }) => {
        setConnectedUsers([...connectedUsers, user])
      })

      s.on("remove_user", (sessionId: string) => {
        setConnectedUsers(connectedUsers.filter(u => u.sessionId !== sessionId))
        // TODO: Remove users' public key (if exists)
      })

      s.on("request_public_key", async (data: string) => {
        if (credentials.keys?.encryptPublicKey) {

          const key = toPEM(await exportPublicKey(credentials.keys.encryptPublicKey), 'PUBLIC');
          s.emit("response_public_key", { sessionId: data, publicKey: key })

        }
      })

      s.on("response_public_key", async (data: { sessionId: string, publicKey: string }) => {
        const key = await importPublicKey(fromPEM(data.publicKey))
        setCryptoKeys({ ...cryptoKeys, [data.sessionId]: key })
      })

      s.on("receive_secret_session_key", async (data: { sessionId: string, key: string }) => {
        if (credentials.keys?.decryptsPrivateKey) {
          const secret = await decryptSecret(data.key, credentials.keys?.decryptsPrivateKey)
          setSessionKeys({ ...sessionKeys, [data.sessionId]: secret })
          console.log(secret);
        }
      })

    });

    s.on("connect_error", (err: any) => {
      console.log("connection error due to...")
      console.error(err)
    });

    s.on("read_message", (res: any) => {
      console.log(res);
    });

    return () => {
      s.disconnect();
    };
  }, [credentials.username])

  return (
    <AppContext.Provider value={{ credentials, setCredentials, connectedUsers, setConnectedUsers, socket, cryptoKeys, sessionKeys, setSessionKeys }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider