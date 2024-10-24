"use client";

import { AppContext } from "@/context/AppContextProvider";
import { SignAndEncryptKeyCollection } from "@/services/keyExtractionService";
import { encryptSecret } from "@/services/encryptionService";
import { Button, Label, TextInput } from "flowbite-react";
import { ChangeEvent, MouseEventHandler, useContext, useState } from "react";
import { HiKey } from "react-icons/hi";

export default function SecretInput(props: {sessionId: string}) {

  const { socket, cryptoKeys, sessionKeys, setSessionKeys } = useContext(AppContext);
  const [secret, setSecret] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(false);
  const [visibleSecret, setVisibleSecret] = useState<boolean>(false);


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSecret = event.target.value
    setSecret(newSecret)
    setEnabled(newSecret !== '')
  }

  const onSubmit : MouseEventHandler = async (e) => {
    
    if (cryptoKeys.hasOwnProperty(props.sessionId)) {

      const keys = cryptoKeys[props.sessionId as keyof typeof cryptoKeys] as unknown as Pick<SignAndEncryptKeyCollection, "encryptPublicKey" | "verifyPublicKey">
      const message = await encryptSecret(secret, keys.encryptPublicKey);
      socket?.emit('send_secret_session_key', {
        key: message,
        sessionId: props.sessionId
      });

      setSessionKeys({ ...sessionKeys, [props.sessionId]: secret })
      console.log(message);
    }
  }

  const toggleVisibility : MouseEventHandler = async (e) => {
    setVisibleSecret(!visibleSecret)
  }

  if (sessionKeys.hasOwnProperty(props.sessionId)) {
    const sessionSecret = sessionKeys[props.sessionId as keyof typeof cryptoKeys] as unknown as string;
    return (
      <div className="flex flex-row items-end">
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="currentSecret" value="The secret for this chat..." />
          </div>
          <TextInput
            id="currentSecret"
            type={visibleSecret ? 'text' : 'password'}
            icon={HiKey}
            value={sessionSecret}
            disabled/>
        </div>
        <div className="h-full">
          <Button type="button" onClick={toggleVisibility}>
            {
            visibleSecret ?  'Hide' : 'Show'
            }
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-end">
      <div className="max-w-md">
        <div className="mb-2 block">
          <Label htmlFor="secret" value="The secret for this chat..." />
        </div>
        <TextInput
          id="secret"
          type={visibleSecret ? 'text' : 'password'}
          icon={HiKey}
          placeholder="Insert the key"
          value={secret}
          onChange={handleChange}/>
      </div>
      <div className="h-full">
        <Button type="button" color="gray" onClick={toggleVisibility}>
          {
            visibleSecret ?  'Hide' : 'Show'
          }
        </Button>
      </div>
      <div className="h-full">
        <Button type="button" onClick={onSubmit} disabled={!enabled}>Send the key</Button>
      </div>
    </div>
  );
}
