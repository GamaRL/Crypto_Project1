"use client"

import { AwaitedReactNode, createContext, Dispatch, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, SetStateAction, useState } from "react";

interface Credentials {
  username: string,
  privateKey: CryptoKey | null,
  publicKey: CryptoKey | null
}

interface AppContextType {
  credentials: Credentials,
  setCredentials: Dispatch<SetStateAction<Credentials>>
}

export const AppContext = createContext<AppContextType>({
  credentials: {
    username: '',
    privateKey: null,
    publicKey: null
  },
  setCredentials: () => {}
})

const AppContextProvider = (props: { children: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => {
        // this state will be shared with all components 
    const [credentials, setCredentials] = useState<Credentials>({
      username: '',
      privateKey: null,
      publicKey: null
    });

    return (
      <AppContext.Provider value={{credentials, setCredentials}}>
        {props.children}
      </AppContext.Provider>
    );
};

export default AppContextProvider