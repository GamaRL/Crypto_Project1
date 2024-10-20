import { useCallback, useEffect, useState } from "react";
import * as io from "socket.io-client";

export const useSocket = (username: string) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [socketResponse, setSocketResponse] = useState({
    content: "",
    username: "",
    messageType: "",
    createdDateTime: "",
  });

  const [isConnected, setConnected] = useState(false);
  const sendData = useCallback(
    (payload: any) => {
      socket?.emit("send_message", {
        content: payload.content,
        username: username,
        messageType: "CLIENT",
      });
    },
    [socket]
  );
  useEffect(() => {
    const SOCKET_BASE_URL = 'http://127.0.0.1:8086/'
    const s = io.connect(SOCKET_BASE_URL, {
      reconnection: false,
      transports: ["websocket", "polling"],
      query: {
        username
      }
    });
    setSocket(s);
    console.log(s);

    s.on("connect", () => {
      console.log("connected")
      setConnected(true)
    });

    s.on("connect_error", (err: any) => {
      console.log("connection error due to...")
      console.log(err)
    });

    s.emit('show_connections', {},(response: string[]) => {
       console.log(response)
    })

    s.on("read_message", (res: any) => {
      console.log(res);
      setSocketResponse({
        content: res.content,
        username: res.username,
        messageType: res.messageType,
        createdDateTime: res.createdDateTime,
      });
    });

    return () => {
      s.disconnect();
    };
  }, []);

  return { socketResponse, isConnected, sendData };
};