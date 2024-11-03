"use client"

import { exportPublicKey, importPublicKey, SignAndEncryptKeyCollection } from "@/services/keyExtractionService";
import { decryptMessage, decryptSecret } from "@/services/encryptionService";
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from "react";
import io from "socket.io-client";
import { fromPEM, toPEM } from "@/services/utilities";
import { generateSymmetricKeyFromPassword } from "@/services/keyGenerationService";
import { verifyMessage } from "@/services/signService";

interface Credentials {
  username: string,
  keys: SignAndEncryptKeyCollection | null
}

export interface Message {
  sender: string,
  receiver: string,
  content: string,
  signature: string,
  date: string
}

interface AppContextType {
  credentials: Credentials,
  setCredentials: Dispatch<SetStateAction<Credentials>>,
  connectedUsers: ConnectedUser[],
  setConnectedUsers: Dispatch<SetStateAction<ConnectedUser[]>>,
  socket: SocketIOClient.Socket | null,
  cryptoKeys: object,
  sessionKeys: object,
  setSessionKeys: Dispatch<SetStateAction<object>>,
  sessionMessages: object,
  setSessionMessages: Dispatch<SetStateAction<object>>,
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
  sessionMessages: {},
  setSessionMessages: () => { }
})

interface AppContextProviderProps {
  children: ReactNode;
}

const SOCKET_BASE_URL = process.env.NEXT_PUBLIC_SOCKET_BASE_URL || 'http://127.0.0.1:8086';

const AppContextProvider : FC<AppContextProviderProps> = (props) => {


  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [cryptoKeys, setCryptoKeys] = useState<object>({});
  const [sessionKeys, setSessionKeys] = useState<object>({});
  const [sessionMessages, setSessionMessages] = useState<object>({});
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);


  const [credentials, setCredentials] = useState<Credentials>({
    username: '',
    keys: null,
  });

  useEffect(() => {

    if (credentials.username === '')
      return

    const s = io.connect(SOCKET_BASE_URL, {
      reconnection: true,
      transports: ["websocket", "polling"],
      query: {
        username: credentials.username
      }
    });


    s.on("connect", () => {
      console.log("Succesfully connected!")

      s.emit('show_connections', {}, (response: { username: string, sessionId: string }[]) => {
        setConnectedUsers(response)
      })
    })

    s.on("connect_error", (err: Error) => {
      console.error("connection error due to...")
      console.error(err)
    });

    s.on("add_user", (user: { username: string, sessionId: string }) => {
      setConnectedUsers(prevConnectedUsers => ([...prevConnectedUsers, user]))
    })

    s.on("remove_user", (sessionId: string) => {
      setConnectedUsers(prevConnectedUsers => prevConnectedUsers.filter(u => u.sessionId !== sessionId))
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
      console.log(data.publicKey);    // Log
      setCryptoKeys(prevCryptoKeys => ({ ...prevCryptoKeys, [data.sessionId]: key }))
    })


    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [credentials])

  useEffect(() => {

    if (socket === null) {

      return
    }

    socket.removeEventListener("receive_secret_session_key");
    socket.removeEventListener("receive_message");

    socket.on("receive_secret_session_key", async (data: { sessionId: string, key: string }) => {
      if (credentials.keys?.decryptsPrivateKey) {
        const before = {secret: data.key}   // Log
        const secret = await decryptSecret(data.key, credentials.keys.decryptsPrivateKey)
        const decrypted = {secret}          // Log
        console.table({before, decrypted}); // Log
        setSessionKeys(prevSessionKeys => ({ ...prevSessionKeys, [data.sessionId]: secret }))
      }
    })

    socket.on("receive_message", async (data: Message) => {

      if (sessionKeys.hasOwnProperty(data.sender) && credentials.keys) {

        const sessionSecret = sessionKeys[data.sender as keyof typeof sessionKeys] as unknown as string;
        const messages = sessionMessages.hasOwnProperty(data.sender) ? sessionMessages[data.sender as keyof typeof sessionMessages] as unknown as Message[] : [];
        const userKeys = cryptoKeys[data.sender as keyof typeof cryptoKeys] as unknown as Pick<SignAndEncryptKeyCollection, "encryptPublicKey" | "verifyPublicKey">

        const symmetricKey = await generateSymmetricKeyFromPassword(sessionSecret);

        const decryptedMessage = await decryptMessage(data.content, symmetricKey);

        const before = {message: data.content, signature: data.signature} // Log

        if (await verifyMessage(data.signature, decryptedMessage, userKeys.verifyPublicKey)) {
          data.content = decryptedMessage;
        } else {
          data.content = "[This message is dangerous]";
        }

        const decrypted = {message: data.content} // Log
        console.table({before, decrypted}); // Log

        setSessionMessages(prevSessionMessages => ({
          ...prevSessionMessages,
          [data.sender]: [...messages, data]
        }))
      }
    })

  }, [socket, cryptoKeys, sessionKeys, sessionMessages])

  return (
    <AppContext.Provider value={{ credentials, setCredentials, connectedUsers, setConnectedUsers, socket, cryptoKeys, sessionKeys, setSessionKeys, sessionMessages, setSessionMessages }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider
