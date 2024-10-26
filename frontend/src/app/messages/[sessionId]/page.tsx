"use client";

import { AppContext } from "@/context/AppContextProvider";
import { useParams, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Sidebar from "../Sidebar";
import SecretInput from "./SecretInput";
import RequestKeyAlert from "./RequestKeyAlert";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";


export default function Home() {
  const { credentials, connectedUsers, sessionMessages } = useContext(AppContext);
  const router = useRouter()
  const params = useParams<{ sessionId: string }>();
  const isConnected = connectedUsers.some(u => u.sessionId === params.sessionId);

  const userData = connectedUsers.find(u => u.sessionId === params.sessionId);

  console.log(sessionMessages);
  


  if (credentials.username === '' || !credentials.keys === null) {
    router.push('/login')

    return <div>
      Not allowed
    </div>
  }

  if (!isConnected)
    router.push('/messages')

  return (
    <main className="flex flex-column">
      <Sidebar />
      <div className="p-20 w-full">

        {
          isConnected
            ?
            <main>
              <div>
                <h1 className="text-xl text-bold my-10">
                  Chat con el usuario {userData?.username}
                </h1>
              </div>
              <RequestKeyAlert sessionId={params.sessionId}/>
              <SecretInput sessionId={params.sessionId} />

              <div className="container flex flex-column bg-red-500 p-10 mt-10 mb-5 max-h-md h-full">
                <MessageBubble/>
              </div>
              <div>
                <MessageInput sessionId={params.sessionId}/>
              </div>
              
            </main>
            :
            <div>
              Connection lost :(
            </div>
        }


      </div>

    </main>
  );
}