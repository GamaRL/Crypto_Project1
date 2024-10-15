"use client"

import { Button, TextInput } from "flowbite-react";
import { FileInput } from "flowbite-react/components/FileInput";
import { Label } from "flowbite-react/components/Label";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function Home() {

  const [privKey, setPrivKey] = useState<string>('');
  const [pubKey, setPubKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const username = event.target.textContent

    if (username?.length == 0) {
      setError('Plase fill all the data')
    }
  }

  const handleFileChange = (event : ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    let pub = -1, priv = -1;

    // Validate PUBLIC and PRIVATE keys
    if (files && files.length == 2) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].name.endsWith(".pub")) pub = i;
        if (files[i].name.endsWith(".key")) priv = i;
      }

      const pubFile = event.target.files?.[pub];
      if (pubFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPubKey(e.target?.result as string); // Set the file content to state
          console.log(pubKey);
        };
        reader.readAsText(pubFile); // Read the file as text
      }

      const privFile = event.target.files?.[priv];
      if (privFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPrivKey(e.target?.result as string); // Set the file content to state
          console.log(privKey);
        };
        reader.readAsText(privFile); // Read the file as text
      }
    } else {
      setError("Please select a .pub file and a .key file")
    }

  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" autoComplete="off">
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">Proyecto 1 - Criptografía</h5>
          <div>
            <Label htmlFor="username" value="Username" />
            <TextInput id="username" placeholder="Enter your username"/>
          </div>
          <div>
            <Label htmlFor="password" value="Password" />
            <TextInput id="password" type="password" placeholder="Enter your password"/>
          </div>
          <div>
            <Label htmlFor="keys" value="Upload file" />
            <FileInput id="keys" multiple accept=".key,.pub" helperText="Extenssions .key .pub" onChange={handleFileChange}/>
          </div>
          <Button className="w-full" size="sm" color="blue" disabled={disabled}>Login to your account</Button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Don't have keys? <Link href="/keyGeneration" className="text-blue-700 hover:underline dark:text-blue-500">Generate keys</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
