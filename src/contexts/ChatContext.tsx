import React, { createContext, FC, ReactElement, useContext } from 'react';

import { ChatReducerState, useChat } from '../hooks/useChat';

const ChatContext = createContext<ChatReducerState | undefined>(undefined);

const ChatStateContextProvider: FC<{ children: ReactElement }> = ({
  children,
}) => {
  const value = useChat();
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

const useChatStateContext = (): ChatReducerState => {
  const context = useContext(ChatContext);

  if (context === undefined)
    throw new Error(
      'useChatStateContext must be used within ConnectionProvider',
    );

  return context;
};

export { ChatStateContextProvider, useChatStateContext };
