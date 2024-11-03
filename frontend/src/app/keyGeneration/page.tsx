"use client"

import { exportKeys } from "@/services/keyExtractionService";
import { Button, TextInput } from "flowbite-react";
import { Label } from "flowbite-react/components/Label";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function KeyGeneration() {

  const [password, setPassword] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);

  // Function to download a file given a filename and its content
  function downloadFile(filename: string, content: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const onChange = (event : ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setDisabled(event.target.value.length < 8);
  }

  const onGenerate = async () => {
    const keys = await exportKeys(password)
    downloadFile('public.pem', keys.publicKeyPEM)
    downloadFile('private.key', keys.privateKeyPEM)
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" autoComplete="off">
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">Key Generation</h5>
          <div>
            <Label htmlFor="password" value="Password" />
            <TextInput
              id="password"
              type="password"
              placeholder="Enter your password"
              onChange={onChange}
            />
          </div>
          <Button
            className="w-full"
            size="sm"
            color="blue"
            disabled={disabled}
            onClick={onGenerate}
          >Download your keys</Button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Already have your keys? <Link href="/login" className="text-blue-700 hover:underline dark:text-blue-500">Login</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
