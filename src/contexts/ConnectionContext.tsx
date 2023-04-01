import React, { FC, ReactElement, createContext, useContext } from 'react';

import { ConnectionReducerState, useConnection } from '../hooks/useConnection';

const ConnectionContext = createContext<ConnectionReducerState | undefined>(
  undefined,
);

const ConnectionProvider: FC<{
  children: ReactElement;
  onConnectionLost: () => void;
}> = ({ children, onConnectionLost }) => {
  const value = useConnection({
    onConnectionLost,
  });
  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

const useConnectionContext = (): ConnectionReducerState => {
  const context = useContext(ConnectionContext);

  if (context === undefined)
    throw new Error(
      'useConnectionContext must be used within ConnectionProvider',
    );

  return context;
};

export { ConnectionProvider, useConnectionContext };
