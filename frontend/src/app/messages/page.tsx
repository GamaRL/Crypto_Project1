"use client";

import { AppContext } from "@/context/AppContextProvider";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Sidebar from "./Sidebar";
import DefaultBanner from "./DefaultBanner";

export default function Home() {
  const { credentials } = useContext(AppContext);
  const router = useRouter()

  console.log(credentials);


  if (credentials.username === '' || !credentials.publicKey || !credentials.privateKey) {
    router.push('/login')

    return <div>
      Not allowed
    </div>

  }

  return (
    <main className="flex flex-column">
      <Sidebar />
      <div className="p-20 w-full">
        <div>
          <DefaultBanner />
        </div>


      </div>

    </main>
  );
}