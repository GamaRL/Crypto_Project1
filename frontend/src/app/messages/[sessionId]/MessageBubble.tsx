import { AppContext, Message } from "@/context/AppContextProvider";
import { useContext } from "react";


function MyMessageBubble(props: {message: Message, username: string}) {
  const {message, username} = props;
  return (
    <div className="flex justify-end items-start gap-2.5 my-2.5">
      <div className="relative flex items-center justify-center w-10 h-10 bg-blue-500 text-white font-bold rounded-full">
        {username.charAt(0)}
      </div>

      <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">You</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{message.date}</span>
        </div>
        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message.content}</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
      </div>
    </div>
  )
}

function SomeoneMessageBubble(props:{message: Message, username: string}) {
  const {message, username} = props;
  return (
    <div className="flex justify-start items-start gap-2.5 my-2.5">
      <div className="relative flex items-center justify-center w-10 h-10 bg-lime-500 text-white font-bold rounded-full">
        {username.charAt(0)}
      </div>

      <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{username}</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{message.date}</span>
        </div>
        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message.content}</p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Received</span>
      </div>
    </div>
  )
}

export default function MessageBubble(props: { message: Message }) {

  const { connectedUsers, socket, credentials } = useContext(AppContext);
  const { message } = props;
  const name = connectedUsers.find(u => u.sessionId === message.sender)?.username || '[Not found]';

  if (message.receiver === socket?.id)
    return <SomeoneMessageBubble message={message} username={name}/>
  return <MyMessageBubble message={message} username={credentials.username}/>
}