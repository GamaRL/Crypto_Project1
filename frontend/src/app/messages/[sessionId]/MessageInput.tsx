"use client";

import { AppContext, Message } from "@/context/AppContextProvider";
import { encryptMessage } from "@/services/encryptionService";
import { Button, TextInput } from "flowbite-react";
import { ChangeEvent, MouseEventHandler, useContext, useState } from "react";
import { HiMail, HiArrowNarrowRight } from "react-icons/hi";
import { generateSymmetricKeyFromPassword } from "@/services/keyGenerationService";
import { signMessage } from "@/services/signService";

export default function MessageInput(props: {sessionId: string}) {

  const { credentials, socket, cryptoKeys, sessionKeys, sessionMessages, setSessionMessages } = useContext(AppContext);
  const [messageContent, setMessage] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(false);

  const canStartInput = cryptoKeys.hasOwnProperty(props.sessionId) && sessionKeys.hasOwnProperty(props.sessionId);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSecret = event.target.value
    setMessage(newSecret)
    setEnabled(newSecret !== '')
  }

  const onSubmit : MouseEventHandler = async () => {
    
    if (sessionKeys.hasOwnProperty(props.sessionId) && credentials.keys) {
      const sessionKey = sessionKeys[props.sessionId as keyof typeof sessionKeys] as unknown as string;
      const messages = sessionMessages.hasOwnProperty(props.sessionId) ? sessionMessages[props.sessionId as keyof typeof sessionMessages] as unknown as Message[] : [];
      const symmetricKey = await generateSymmetricKeyFromPassword(sessionKey);


      const message: Message = {
        receiver: props.sessionId,
        sender: socket?.id || 'yo',
        content: await encryptMessage(messageContent, symmetricKey),
        signature: await signMessage(messageContent, credentials.keys.signPrivateKey),
        date: '2024-05-03',
      }

      socket?.emit('send_message', message)

      message.content = messageContent

      setSessionMessages(prevSessionMessages => ({
        ...prevSessionMessages,
        [props.sessionId]: [...messages, message]
      }))

      setMessage('')
    }
    
  }

  return (
    <div className="flex flex-row justify-evenly w-full">
      <div className="w-full shrink">
        <TextInput
          id="secret"
          type="text"
          icon={HiMail}
          placeholder="Insert the Message"
          value={messageContent}
          onChange={handleChange}
          disabled={!canStartInput}/>
      </div>
      <div className="ml-5">
        <Button className="rounded-full h-10 w-10" type="button" onClick={onSubmit} disabled={!enabled && !canStartInput}>
          <HiArrowNarrowRight/>
        </Button>
      </div>
    </div>
  );
}
