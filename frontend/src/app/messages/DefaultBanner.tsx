"use client";

import { HiUserCircle } from "react-icons/hi";

export default function Component() {
  return (
    <div className="flex flex-col justify-center h-96 items-center w-full">
      <div>
        <HiUserCircle className="h-64 w-64 m-10" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">
          Secure Chat
        </h2>
      </div>
      <div>
        <h5 className="mb-1 text-base font-semibold text-white text-center">Don&apos;t you know how to start?</h5>
        <p className="flex items-center text-sm font-normal text-gray-400 text-center">
          Please select a chat with connected users
        </p>
      </div>
    </div>
  );
}