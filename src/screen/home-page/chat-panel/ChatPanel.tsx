/* eslint-disable no-return-assign */
import React, { useEffect, useRef } from 'react';

import { useChatStateContext } from '../../../contexts/ChatContext';
import { useConnectionContext } from '../../../contexts/ConnectionContext';
import { ChatActions, ChatFile, MessageType } from '../../../hooks/useChat';
import { getInitials } from '../../../util/string.util';
import './ChatPanel.scss';
import ReceiveFileView from './view/ReceiveFileView';
import ReceiveView from './view/ReceiveView';
import SendFileView from './view/SendFileView';
import SendView from './view/SendView';

const ChatPanel = () => {
  const { dispatchChatState, chatState } = useChatStateContext();
  const { connectionState, sendMessage } = useConnectionContext();

  const { name, partnerName } = connectionState;

  const { chatData, isNewMessageAvailable } = chatState;

  const chatListGrownContainerRef = useRef<HTMLDivElement>(null);
  const chatListParentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sendButtonRef = useRef<HTMLDivElement>(null);
  const sendInputboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(chatListParentRef?.current);

    if (sendInputboxRef?.current) {
      sendInputboxRef.current.addEventListener('keypress', function (e) {
        const event = e || window.event;
        const char = event.which || event.keyCode;
        if (char === 13 && sendButtonRef?.current) {
          sendButtonRef.current.click();
        }
      });
    }

    chatListGrownContainerRef?.current?.addEventListener('scroll', (event) => {
      const element = event.target as HTMLDivElement;
      if (
        element &&
        element.scrollHeight - element.scrollTop === element.clientHeight
      ) {
        dispatchChatState({ type: ChatActions.CLEAR_NEW_MESSAGE });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToBottom = () => {
    if (chatListGrownContainerRef?.current && chatListParentRef?.current)
      (chatListGrownContainerRef?.current ?? {}).scrollTop =
        chatListParentRef?.current?.scrollHeight;
    dispatchChatState({ type: ChatActions.CLEAR_NEW_MESSAGE });
  };

  const onSendClick = () => {
    const { current: sendInputbox } = sendInputboxRef ?? {};
    if (sendInputbox && sendInputbox.value && sendInputbox.value.length > 0) {
      dispatchChatState({
        type: ChatActions.SENT_MESSAGE,
        value: sendInputbox.value,
      });
      sendMessage({
        type: MessageType.MSG,
        value: sendInputbox.value,
      });
      sendInputbox.value = '';
      setTimeout(scrollToBottom, 100);
    }
  };

  const showNewMessageButton = () => {
    if (
      chatListGrownContainerRef?.current &&
      chatListParentRef?.current &&
      chatListGrownContainerRef?.current.offsetHeight <=
        chatListParentRef?.current.scrollHeight
    )
      return true;
    dispatchChatState({
      type: ChatActions.CLEAR_NEW_MESSAGE,
    });
    return false;
  };

  const onUploadAttachment = () => {
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const onFileInputChange = (event) => {
    const file = event.target.files[0];
    const blob = new Blob(event.target.files, { type: file.type });
    sendMessage({
      type: MessageType.INFO,
      value: `${name} is sending you a file (${file.name}).\n(Large files may take time to receive)`,
    });
    sendMessage({
      type: MessageType.FILE_RECEIVED,
      value: {
        file: blob,
        filename: file.name,
        filetype: file.type,
      },
    });
    dispatchChatState({
      type: ChatActions.SENT_FILE,
      value: {
        file: blob,
        filename: file.name,
        filetype: file.type,
      },
    });
    setTimeout(scrollToBottom, 100);
  };

  return (
    <div className="col-12 col-xl-8 pr-0">
      <div className="position-relative column chat-panel card d-flex flex-column justify-content-between">
        <div className="chat-header d-flex flex-row">
          <div className="initial-indicator d-flex justify-content-center">
            <span>{getInitials(partnerName)}</span>
          </div>
          {partnerName}
        </div>
        <div
          className="flex-grow-1 d-flex flex-column chat-view py-3 px-3 overflow-auto"
          ref={chatListGrownContainerRef}
        >
          <div ref={chatListParentRef}>
            <div className="alert alert-info mx-auto">
              You are connected to your partner via peer ro peer communication.
              If connection is lost, you cannot be able to connect back with the
              already used link.
            </div>
            {chatData.map((data) => (
              <>
                {data.type === MessageType.INFO && (
                  <div className="alert alert-info mx-auto">{data.data}</div>
                )}
                {data.type === MessageType.MSG && data.isSent && (
                  <SendView data={data.data as string} date={data.date} />
                )}
                {data.type === MessageType.MSG && !data.isSent && (
                  <ReceiveView data={data.data as string} date={data.date} />
                )}
                {data.type === MessageType.FILE_SENT && (
                  <SendFileView data={data.data as ChatFile} date={data.date} />
                )}
                {data.type === MessageType.FILE_RECEIVED && (
                  <ReceiveFileView
                    data={data.data as ChatFile}
                    date={data.date}
                  />
                )}
              </>
            ))}
          </div>
        </div>
        <div className="chat-send-view position-relative d-flex flex-row">
          <div className="position-relative flex-grow-1 pr-2">
            <input
              className="w-100"
              id="send-input-box"
              placeholder="Type & press enter to send"
              ref={sendInputboxRef}
            />
            <div
              className="send-button"
              onClick={onSendClick}
              ref={sendButtonRef}
              role="button"
            >
              <i className="fas fa-paper-plane" />
            </div>
          </div>
          <button
            className="btn btn-primary rounded rounded-circle"
            onClick={onUploadAttachment}
            type="button"
          >
            <i className="fas fa-paperclip" />
          </button>
          <input
            className="d-none"
            onChange={onFileInputChange}
            ref={fileInputRef}
            type="file"
          />
        </div>
        {isNewMessageAvailable && showNewMessageButton() && (
          <button
            className="btn btn-info new-message-available"
            onClick={scrollToBottom}
            type="button"
          >
            New Messages
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
