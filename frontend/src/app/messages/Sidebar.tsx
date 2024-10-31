"use client";

import { AppContext } from "@/context/AppContextProvider";
import { Sidebar } from "flowbite-react";
import Link from "next/link";
import { useContext } from "react";
import { HiUser } from "react-icons/hi";

export default function Component() {
  const {connectedUsers, credentials} = useContext(AppContext)
  return (
    <Sidebar className="h-screen w-1/4">
      <Link href={'/'} passHref legacyBehavior>
        <Sidebar.Logo href="#" img="/images/live-chat.png" imgAlt="--" color="dark">
          <h1 className="text-gray-700 dark:text-white">
            Connected Users
          </h1>
        </Sidebar.Logo>
      </Link>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link href={`/messages`} passHref legacyBehavior>
            <Sidebar.Item href="#" icon={HiUser}>
              You: {credentials.username}
            </Sidebar.Item>
          </Link>
          {
            connectedUsers.map(u => {
              return (
                <Link href={`/messages/${u.sessionId}`} passHref legacyBehavior>
                  <Sidebar.Item href="#" icon={HiUser} id={u.sessionId}>
                    {u.username}
                  </Sidebar.Item>
                </Link>
              );
            })
          }
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
