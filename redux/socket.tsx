import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";

export let socket: Socket | null = null;

// Use this to initialize socket once
export const initializeSocket = (serverUrl: string) => {
  if (socket) return socket; // already initialized

  socket = io(serverUrl, {
    transports: ["websocket"], // force WebSocket
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on("connect", () => console.log("✅ Socket connected:", socket?.id));
  socket.on("connect_error", (err) =>
    console.log("❌ Socket connect_error:", err.message)
  );
  socket.on("disconnect", (reason) =>
    console.log("❌ Socket disconnected:", reason)
  );
  socket.on("reconnect_attempt", (attempt) =>
    console.log("🔄 Socket reconnect attempt:", attempt)
  );

  return socket;
};

export const getSocket = () => {
  if (!socket)
    throw new Error("Socket not initialized. Call initializeSocket() first.");
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// --- Custom hook for subscribing to events safely ---
export const useSocketEvents = (
  socket: Socket | null,
  events: Record<string, (...args: any[]) => void>
) => {
  useEffect(() => {
    if (!socket) return;

    Object.entries(events).forEach(([event, handler]) => {
      socket.on(event, handler); // TS now knows handler is a proper function
    });

    return () => {
      Object.entries(events).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, events]);
};
