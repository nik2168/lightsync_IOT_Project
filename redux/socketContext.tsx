import React, { useEffect, useState } from "react";
import { initializeSocket, disconnectSocket, socket } from "./socket";

const SERVER_URL = "http://192.168.43.242:3333"; // your LAN IP & backend port

const SocketInit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const s = initializeSocket(SERVER_URL);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      disconnectSocket();
    };
  }, []);

  if (!isConnected) {
    return (
      <></> // or a loading spinner while socket connects
    );
  }

  return <>{children}</>;
};

export default SocketInit;
