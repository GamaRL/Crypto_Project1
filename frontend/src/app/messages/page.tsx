"use client";

import { AppContext } from "@/context/AppContextProvider";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import Sidebar from "./Sidebar";
import DefaultBanner from "./DefaultBanner";
import { Spinner } from "flowbite-react";

export default function Home() {
  const { credentials } = useContext(AppContext);
  const router = useRouter()


  if (credentials.username === '' || credentials.keys === null) {
    router.push('/login')

    return <main className="flex h-screen justify-center">
      <div className="flex flex-wrap items-center gap-2">
        <Spinner aria-label="Small spinner example" size="sm" />
        <p>Not allowed, redirecting to login</p>
      </div>
    </main>

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