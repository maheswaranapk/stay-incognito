import { useEffect, useReducer, useState } from 'react';

import Peer, { DataConnection } from 'peerjs';

import { useChatStateContext } from '../contexts/ChatContext';
import { ChatActions, MessageType } from './useChat';

// eslint-disable-next-line no-shadow
export enum ConnectionActions {
  CONNECTION_CLOSED,
  CONNECTION_ESTABLISHED,
  INITIALIZE_AND_SET_HOST_ID,
  PEER_CONNECTED,
  SET_NAME,
  SET_PEER_ID,
}

export type ConnectionState = {
  connectionId?: string | null;
  hostId?: string | null;
  isConnected?: boolean;
  isLoading?: boolean;
  name?: string | null;
  partnerName?: string | null;
  peerId?: string | null;
};

const INITIAL_CONNECTION_STATE: ConnectionState = {
  connectionId: null,
  hostId: null,
  isConnected: false,
  isLoading: true,
  name: null,
  partnerName: null,
  peerId: null,
};

function connectionStateReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case ConnectionActions.CONNECTION_CLOSED:
      return {
        ...state,
        hostId: null,
        isConnected: false,
        isLoading: true,
      };
    case ConnectionActions.CONNECTION_ESTABLISHED:
      return {
        ...state,
        connectionId: payload.connectionId,
        isConnected: true,
        isLoading: false,
      };
    case ConnectionActions.INITIALIZE_AND_SET_HOST_ID:
      return {
        ...INITIAL_CONNECTION_STATE,
        hostId: payload.hostId,
        isLoading: true,
      };

    case ConnectionActions.SET_NAME:
      return {
        ...state,
        name: payload.name,
        partnerName: payload.partnerName,
      };
    case ConnectionActions.SET_PEER_ID:
      return {
        ...state,
        isLoading: !!payload.hostId,
        peerId: payload.peerId,
      };
    default:
      return state;
  }
}

export type ConnectionReducer = (
  state: ConnectionState,
  action: {
    type: ConnectionActions;
    payload: ConnectionState;
  },
) => ConnectionState;

export type ConnectionReducerState = {
  connectionState: ConnectionState;
  initiatePeer: (hostId: { hostId: string }) => void;
  sendMessage: (data: any) => void;
};

export const useConnection = ({
  onConnectionLost,
}: {
  onConnectionLost: () => void;
}): ConnectionReducerState => {
  const [connectionState, dispatchConnectionState] =
    useReducer<ConnectionReducer>(
      connectionStateReducer,
      INITIAL_CONNECTION_STATE,
    );

  const [peer, setPeer] = useState<Peer | null>(null);
  const [connection, setConnection] = useState<DataConnection | null>(null);

  const { dispatchChatState } = useChatStateContext();

  const disconnectConnection = () => {
    if (peer) peer.destroy();
  };

  const sendMessage = (data) => {
    if (connection && connection.open) connection.send(data);
  };

  const onReceive = (data) => {
    switch (data.type) {
      case MessageType.FILE_RECEIVED:
        dispatchChatState({
          type: ChatActions.RECEIVE_FILE,
          value: data.value,
        });
        break;
      case MessageType.INFO:
        dispatchChatState({ type: ChatActions.SET_INFO, value: data.value });
        break;
      case MessageType.SET_NAME:
        dispatchConnectionState({
          payload: {
            name: data.hostName as string,
            partnerName: data.partnerName as string,
          },
          type: ConnectionActions.SET_NAME,
        });
        break;
      case MessageType.MSG:
        dispatchChatState({
          type: ChatActions.RECEIVE_MESSAGE,
          value: data.value,
        });
        break;
      default:
        break;
    }
  };

  const onClientConnectionEstablished = () => {
    const hostName = window.randomAnimal();
    let myName = window.randomAnimal();

    while (hostName === myName) myName = window.randomAnimal();

    dispatchConnectionState({
      payload: { name: myName, partnerName: hostName },
      type: ConnectionActions.SET_NAME,
    });

    sendMessage({
      hostName,
      partnerName: myName,
      type: MessageType.SET_NAME,
    });

    sendMessage({
      type: MessageType.INFO,
      value: `You(${hostName}) are connected to you Partner(${myName})`,
    });

    dispatchChatState({
      type: ChatActions.SET_INFO,
      value: `You(${myName}) are connected to you Partner(${hostName})`,
    });
  };

  const initializeConnectionListener = () => {
    connection?.on('open', () => {
      const { hostId } = connectionState;
      if (hostId && connection) {
        onClientConnectionEstablished();
      }

      dispatchConnectionState({
        payload: { connectionId: connection?.peer },
        type: ConnectionActions.CONNECTION_ESTABLISHED,
      });

      connection?.on('data', (data) => {
        onReceive(data);
      });
      connection?.on('close', onConnectionLost);
      connection?.on('error', onConnectionLost);
    });
  };

  useEffect(() => {
    if (connection) initializeConnectionListener();
  }, [connection]);

  const onPeerOpen = (id: string) => {
    const { hostId } = connectionState;
    if (hostId && peer) setConnection(peer.connect(hostId));
    else
      dispatchConnectionState({
        payload: { peerId: id },
        type: ConnectionActions.SET_PEER_ID,
      });
  };

  const onPeerConnection = (conn) => setConnection(conn);

  useEffect(() => {
    if (!peer) return;
    peer.on('open', onPeerOpen);
    peer.on('connection', onPeerConnection);
    peer.on('close', onConnectionLost);
    peer.on('error', () => onConnectionLost);
    peer.on('disconnected', onConnectionLost);
  }, [peer]);

  const initiatePeer = ({ hostId }: { hostId: string }) => {
    dispatchConnectionState({
      payload: { hostId },
      type: ConnectionActions.INITIALIZE_AND_SET_HOST_ID,
    });
    setPeer(
      new Peer({
        secure: true,
      }),
    );
    window.addEventListener('beforeunload', disconnectConnection);
  };

  useEffect(
    () => () =>
      window.removeEventListener('beforeunload', disconnectConnection),
    [],
  );

  return {
    connectionState,
    initiatePeer,
    sendMessage,
  };
};
