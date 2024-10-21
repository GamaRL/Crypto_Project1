"use client";

import { AppContext } from "@/context/AppContextProvider";
import { Alert, Button, ButtonGroup } from "flowbite-react";
import { MouseEventHandler, useContext } from "react";
import { HiInformationCircle } from "react-icons/hi";

function AlertContent(props: {onClick: MouseEventHandler<HTMLButtonElement>}) {
  return (
    <>
      <div className="mb-4 mt-2 text-sm text-cyan-700 dark:text-cyan-800">
        You must request this user public key in order to establish a secure communication
      </div>
      <div className="flex">
        <Button
          onClick={props.onClick}
          size="sm"
        >
          Send the request
        </Button>
      </div>
    </>
  );
}

export default function RequestKey(data: {sessionId: string}) {

  const { socket, cryptoKeys } = useContext(AppContext);

  const handleButton : MouseEventHandler<HTMLButtonElement> = (event) => {
    socket?.emit('request_public_key', data.sessionId)
  }

  if (!cryptoKeys.hasOwnProperty(data.sessionId))
  return (
    <div>
      <Alert color="warning" icon={HiInformationCircle} additionalContent={<AlertContent onClick={handleButton}/>}>
        <span className="font-medium">You don't have his user public key!</span>
      </Alert>
    </div>
  )

  return <></>
}