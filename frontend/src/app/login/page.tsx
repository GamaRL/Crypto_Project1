"use client"

import { AppContext } from "@/context/AppContextProvider";
import { importKeys } from "@/services/keyExtractionService";
import { generateSymmetricKeyFromPassword } from "@/services/keyGenerationService";
import { Button, TextInput } from "flowbite-react";
import { FileInput } from "flowbite-react/components/FileInput";
import { Label } from "flowbite-react/components/Label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useContext, useState } from "react";

export default function Home() {

  const [privKey, setPrivKey] = useState<string>('')
  const [pubKey, setPubKey] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [disabled, setDisabled] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const router = useRouter()
  const {credentials, setCredentials} = useContext(AppContext)


  if (credentials.username !== '' || credentials.keys !== null) {
    router.push('/messages')

    return (
      <div>
        <p>Not allowed</p>
      </div>
    )
  }

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value || '';

    setUsername(input);
  }

  const handlePasswordChange = (event : ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value || '';

    setPassword(input);
  }

  const readPublicKeyFile = (event : ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length === 0)
      setError('Please select a file')

    const pubFile = event.target.files?.[0];
    if (pubFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPubKey(e.target?.result as string); // Set the file content to state
      };
      reader.readAsText(pubFile); // Read the file as text
    }
  }

  const readPrivateKeyFile = (event : ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length === 0)
      setError('Please select a file')

    const privFile = event.target.files?.[0];
    if (privFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrivKey(e.target?.result as string); // Set the file content to state
        console.log(e.target?.result as string);
      };
      reader.readAsText(privFile); // Read the file as text
    }
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    try {

      if (username.length === 0) {
        setError('Please enter a name')
        return
      }

      if (password.length < 8) {
        setError('The password must be 8-characters long')
        return
      }

      const symmetricKey = await generateSymmetricKeyFromPassword(password);
      const keyCollection = await importKeys(privKey, pubKey, symmetricKey);

      setTimeout(() => {
        router.push('/messages')
      }, 1000)

      setDisabled(true);
      setSuccess('Welcome');

      setCredentials({
        username,
        keys: keyCollection,
      })

    } catch (err) {
      console.error(err);
      
      setError('An error ocurred with the provided keys');
    }
  }


  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" autoComplete="off" onSubmit={onSubmit}>
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">Proyecto 1 - Criptografía</h5>
          <div>
            <Label htmlFor="username" value="Username" />
            <TextInput id="username" placeholder="Enter your username" onChange={handleChangeName} value={username} />
          </div>
          <div>
            <Label htmlFor="password" value="Password" />
            <TextInput id="password" type="password" placeholder="Enter your password" onChange={handlePasswordChange} value={password} />
          </div>
          <div>
            <Label htmlFor="public_key" value="Select Public Key" />
            <FileInput id="public_key" accept=".pem" helperText="Extenssion: .pem" onChange={readPublicKeyFile} />
          </div>
          <div>
            <Label htmlFor="private_key" value="Select Private Key" />
            <FileInput id="private_key" accept=".key" helperText="Extenssion: .key" onChange={readPrivateKeyFile} />
          </div>
          <div>
            <span className="text-red-400 text-sm text-bolder">{error}</span>
          </div>
          <div>
            <span className="text-green-400 text-sm text-bolder">{success}</span>
          </div>
          <Button className="w-full" size="sm" color="blue" type="submit" disabled={disabled}>Login to your account</Button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Don't you have keys? <Link href="/keyGeneration" className="text-blue-700 hover:underline dark:text-blue-500">Generate keys</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
