"use client";

import { AppContext } from "@/context/AppContextProvider";
import { useParams, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Sidebar from "../Sidebar";
import SecretInput from "./SecretInput";
import RequestKeyAlert from "./RequestKeyAlert";


export default function Home() {
  const { credentials, connectedUsers, socket } = useContext(AppContext);
  const router = useRouter()
  const params = useParams<{ sessionId: string }>();
  const isConnected = connectedUsers.some(u => u.sessionId === params.sessionId);

  const userData = connectedUsers.find(u => u.sessionId === params.sessionId);


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