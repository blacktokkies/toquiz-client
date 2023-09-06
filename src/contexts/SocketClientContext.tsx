import type { Client as SocketClient } from '@stomp/stompjs';
import type { PropsWithChildren } from 'react';

import React, { createContext, useContext } from 'react';

export const SocketClientContext = createContext<SocketClient | null>(null);

type SocketClientProviderProps = {
  client: SocketClient;
} & PropsWithChildren;

export function SocketClientProvider({
  client,
  children,
}: SocketClientProviderProps): JSX.Element {
  return (
    <SocketClientContext.Provider value={client}>
      {children}
    </SocketClientContext.Provider>
  );
}

export const useSocketClient = (): SocketClient => {
  const socketClient = useContext(SocketClientContext);

  if (socketClient === null) {
    throw new Error(
      'Error: No SocketClientContext set, use SocketClientProvider to set one',
    );
  }

  return socketClient;
};
