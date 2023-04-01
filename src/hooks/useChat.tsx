import { Dispatch, useReducer } from 'react';

// eslint-disable-next-line no-shadow
export enum ChatActions {
  CLEAR_NEW_MESSAGE,
  RECEIVE_MESSAGE,
  RECEIVE_FILE,
  SENT_FILE,
  SET_INFO,
  SENT_MESSAGE,
}

// eslint-disable-next-line no-shadow
export enum MessageType {
  INFO,
  FILE_RECEIVED,
  FILE_SENT,
  MSG,
  SET_NAME,
}

export interface ChatFile {
  file: Blob;
  filename: string;
  filetype: string;
}

export interface Chat {
  type: MessageType;
  data: string | ChatFile;
  date: Date;
  isSent: boolean;
}

export type ChatState = {
  chatData: Chat[];
  isNewMessageAvailable: boolean;
};

const initialState: ChatState = {
  chatData: [],
  isNewMessageAvailable: false,
};

function chatStateReducer(state, action) {
  switch (action.type) {
    case ChatActions.SENT_MESSAGE:
    case ChatActions.RECEIVE_MESSAGE:
      return {
        ...state,
        chatData: [
          ...state.chatData,
          {
            data: action.value,
            date: new Date(),
            isSent: action.type === ChatActions.SENT_MESSAGE,
            type: MessageType.MSG,
          },
        ],
        isNewMessageAvailable: action.type === ChatActions.RECEIVE_MESSAGE,
      };
    case ChatActions.CLEAR_NEW_MESSAGE:
      return {
        ...state,
        isNewMessageAvailable: false,
      };
    case ChatActions.SET_INFO:
      return {
        ...state,
        chatData: [
          ...state.chatData,
          {
            data: action.value,
            date: new Date(),
            type: MessageType.INFO,
          },
        ],
        isNewMessageAvailable: false,
      };
    case ChatActions.SENT_FILE:
      return {
        ...state,
        chatData: [
          ...state.chatData,
          {
            data: action.value,
            date: new Date(),
            isSent: true,
            type: MessageType.FILE_SENT,
          },
        ],
        isNewMessageAvailable: false,
      };
    case ChatActions.RECEIVE_FILE:
      return {
        ...state,
        chatData: [
          ...state.chatData,
          {
            data: action.value,
            date: new Date(),
            isSent: false,
            type: MessageType.FILE_RECEIVED,
          },
        ],
        isNewMessageAvailable: true,
      };

    default:
      return state;
  }
}

export type ChatReducer = (
  state: ChatState,
  action: {
    type: ChatActions;
    value: string | ChatFile;
  },
) => ChatState;

export type ChatReducerState = {
  dispatchChatState: Dispatch<{
    type: ChatActions;
    value?: string | ChatFile;
  }>;
  chatState: ChatState;
};

export const useChat = (): ChatReducerState => {
  const [chatState, dispatchChatState] = useReducer<ChatReducer>(
    chatStateReducer,
    initialState,
  );
  return {
    chatState,
    dispatchChatState,
  };
};
