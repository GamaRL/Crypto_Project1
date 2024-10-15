"use client"

import { Button, TextInput } from "flowbite-react";
import { Label } from "flowbite-react/components/Label";
import Link from "next/link";
import { useState } from "react";

export default function Home() {

  const [disabled, setDisabled] = useState<boolean>(true);


  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" action="#">
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">Key Generation</h5>
          <div>
            <Label htmlFor="password" value="Password" />
            <TextInput id="password" type="password" placeholder="Enter your password"/>
          </div>
          <Button className="w-full" size="sm" color="blue" disabled={disabled}>Download your keys</Button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Already have your keys? <Link href="/login" className="text-blue-700 hover:underline dark:text-blue-500">Login</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
