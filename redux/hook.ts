// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { useEffect, useState } from "react";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

type ErrorObject = {
  isError: boolean;
  error?: { data?: { message?: string } };
  fallback?: () => void;
};

const useErrors = (errors: ErrorObject[] = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else console.log(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};

function useAsyncMutation<TArgs extends any[], TResult>(
  mutationHook: () => [(...args: TArgs) => Promise<TResult>],
  _showLogs: boolean = true // keeping it in case you want to toggle logs later
): [
  (toastMessage?: string, ...args: TArgs) => Promise<void>,
  boolean,
  TResult | null
] {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<TResult | null>(null);

  const [mutate] = mutationHook();

  const handlerFunction = async (_message?: string, ...args: TArgs) => {
    setIsLoading(true);

    try {
      const res: any = await mutate(...args);
      setData(res?.data);
      console.log(res?.data?.message);

      if (!res?.data) {
        console.log(res?.error?.data?.message || "Something went wrong!");
      }
    } catch (err: any) {
      console.error(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return [handlerFunction, isLoading, data];
}

type SocketHandlerMap = {
  [event: string]: (...args: any[]) => void;
};

const useSocketEvents = (
  socket: { on: Function; off: Function } | null,
  handlers: SocketHandlerMap
) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket?.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket?.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

type ErrorShape = {
  data?: {
    message?: string;
  };
  [key: string]: any;
};

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = String(date.getFullYear()).slice(-2); // last 2 digits

  return `${day}/${month}/${year}`;
};

export { useAsyncMutation, useErrors, useSocketEvents, formatDate };
export type { ErrorShape };
