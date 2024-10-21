"use client"

import { exportPublicKey, fromPEM, importPublicKey, toPEM } from "@/services/generateKeyService";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import io from "socket.io-client";

interface Credentials {
  username: string,
  privateKey: CryptoKey | null,
  publicKey: CryptoKey | null
}

interface AppContextType {
  credentials: Credentials,
  setCredentials: Dispatch<SetStateAction<Credentials>>,
  connectedUsers: ConnectedUser[],
  setConnectedUsers: Dispatch<SetStateAction<ConnectedUser[]>>,
  socket : SocketIOClient.Socket|null,
  cryptoKeys: Object
}

interface ConnectedUser {
  username: string,
  sessionId: string
}

export const AppContext = createContext<AppContextType>({
  credentials: {
    username: '',
    privateKey: null,
    publicKey: null
  },
  setCredentials: () => { },
  connectedUsers: [],
  setConnectedUsers: () => { },
  socket: null,
  cryptoKeys: {}
})

const AppContextProvider = (props: any) => {
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [cryptoKeys, setCryptoKeys] = useState<Object>({});
  const [socket, setSocket] = useState<SocketIOClient.Socket|null>(null);

  const [credentials, setCredentials] = useState<Credentials>({
    username: '',
    privateKey: null,
    publicKey: null
  });

  console.log(cryptoKeys);
  

  useEffect(() => {

    const SOCKET_BASE_URL = 'http://127.0.0.1:8086/'

    if (credentials.username === '')
      return

    const s = io.connect(SOCKET_BASE_URL, {
      reconnection: false,
      transports: ["websocket", "polling"],
      query: {
        username: credentials.username
      }
    });
    setSocket(s);

    s.on("connect", () => {
      console.log("connected")

      s.emit('show_connections', {}, (response: {username: string, sessionId: string}[]) => {
        console.log(response)
        setConnectedUsers(response)
      })

      s.on("add_user", (user: {username: string, sessionId: string}) => {
        setConnectedUsers([...connectedUsers, user])
      })

      s.on("remove_user", (sessionId: string) => {
        setConnectedUsers(connectedUsers.filter(u => u.sessionId !== sessionId))
      })

      s.on("request_public_key", async (data: string) => {
        if (credentials.publicKey) {
          
          const key = toPEM(await exportPublicKey(credentials.publicKey), 'PUBLIC');
          s.emit("response_public_key", {sessionId: data, publicKey: key})

        }
      })

      s.on("response_public_key", async (data: {sessionId: string, publicKey: string}) => {
          
          const key = await importPublicKey(fromPEM(data.publicKey))
          setCryptoKeys({...cryptoKeys, [data.sessionId]: key})
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
    <AppContext.Provider value={{ credentials, setCredentials, connectedUsers, setConnectedUsers, socket, cryptoKeys }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider