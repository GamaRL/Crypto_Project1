"use client";

import { AppContext, Message } from "@/context/AppContextProvider";
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

  const messages = sessionMessages.hasOwnProperty(params.sessionId)
    ? sessionMessages[params.sessionId as keyof typeof sessionMessages] as unknown as Message[]
    : [];

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

              <div className="flex flex-col bg-gray-500 p-10 mt-10 mb-5 max-h-96 overflow-y-auto">
                {
                  messages.map(m => {

                    return <MessageBubble message={m}/>
                  })
                }
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