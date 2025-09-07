import React, { useEffect, useState } from "react";
import { initializeSocket, disconnectSocket, socket } from "./socket";
import Loading from "@/components/custom/Loading";
import { server } from "./config";

const SERVER_URL = server; // your LAN IP & backend port
console.log("SERVER_URL:", SERVER_URL);

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
      <>
        <Loading />
      </> // or a loading spinner while socket connects
    );
  }

  return <>{children}</>;
};

export default SocketInit;
