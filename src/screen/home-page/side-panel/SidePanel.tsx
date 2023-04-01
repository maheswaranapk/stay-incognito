import React, { useMemo, useState } from 'react';

import Credit from '../../../component/credit/Credit';
import Document from '../../../component/document/Document';
import { useChatStateContext } from '../../../contexts/ChatContext';
import { useConnectionContext } from '../../../contexts/ConnectionContext';
import { MessageType } from '../../../hooks/useChat';
import { getInitials } from '../../../util/string.util';
import './SidePanel.scss';

const ALL = 'ALL';
const SENT = 'SENT';
const RECEIVED = 'RECEIVED';

const Badge = ({ currentView, setCurrentView, view }) => (
  <span
    className={`badge mx-1 px-3 py-2 cursor-pointer ${
      currentView === view ? 'badge-dark' : 'badge-light'
    }`}
    onClick={() => {
      setCurrentView(view);
    }}
    role="button"
  >
    {view}
  </span>
);

const NotAvailable = () => (
  <div className="alert alert-light mx-auto text-center mt-5">
    Not Available
  </div>
);

const SidePanel = () => {
  const { connectionState } = useConnectionContext();
  const { chatState } = useChatStateContext();

  const { name } = connectionState;
  const { chatData } = chatState;

  const [currentView, setCurrentView] = useState(ALL);

  const allAttachment = useMemo(
    () =>
      (chatData ?? []).filter(
        (chat) =>
          chat.type === MessageType.FILE_RECEIVED ||
          chat.type === MessageType.FILE_SENT,
      ),
    [chatData],
  );

  const sentAttachment = useMemo(
    () => chatData.filter((chat) => chat.type === MessageType.FILE_SENT),
    [chatData],
  );
  const receivedAttachment = useMemo(
    () => chatData.filter((chat) => chat.type === MessageType.FILE_RECEIVED),
    [chatData],
  );

  return (
    <div className="col-4 column side-panel d-none d-xl-flex flex-column align-items-center justify-content-between mx-0">
      <div className="card w-100 d-flex flex-column align-items-center p-3">
        <div className="initial-indicator d-flex justify-content-center">
          <span>{getInitials(name)}</span>
        </div>
        <div className="my-name mt-3">{name}</div>
      </div>
      <div className="card my-3 flex-grow-1 w-100 p-3">
        <div className="attachment-header">Shared Files</div>
        <div className="list-panel m-auto py-3">
          <Badge
            currentView={currentView}
            setCurrentView={setCurrentView}
            view={ALL}
          />
          <Badge
            currentView={currentView}
            setCurrentView={setCurrentView}
            view={RECEIVED}
          />
          <Badge
            currentView={currentView}
            setCurrentView={setCurrentView}
            view={SENT}
          />
        </div>
        <div className="list-container w-100 flex-grow-1 pb-3 overflow-auto">
          {currentView === ALL && (allAttachment ?? []).length ? (
            allAttachment.map((data) => <Document fileData={data.data} />)
          ) : (
            <NotAvailable />
          )}
          {currentView === SENT &&
            ((sentAttachment ?? []).length ? (
              sentAttachment.map((data) => <Document fileData={data.data} />)
            ) : (
              <NotAvailable />
            ))}
          {currentView === RECEIVED &&
            ((receivedAttachment ?? []).length ? (
              receivedAttachment.map((data) => (
                <Document fileData={data.data} />
              ))
            ) : (
              <NotAvailable />
            ))}
        </div>
      </div>
      <Credit />
    </div>
  );
};

export default SidePanel;
