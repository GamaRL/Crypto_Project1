"use client";

import { AppContext } from "@/context/AppContextProvider";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function Home() {
  const {credentials} = useContext(AppContext);
  const router = useRouter()

  console.log(credentials);
  

  if (credentials.username === '' || !credentials.publicKey || !credentials.privateKey) {
    router.push('/login')

    return <div>
      Not allowed
    </div>

  }

  const {socketResponse, isConnected, sendData} = useSocket(credentials.username)

  return (
    <div>
      <p>Status: { isConnected ? "connected" : "disconnected" }</p>
    </div>
  );
}