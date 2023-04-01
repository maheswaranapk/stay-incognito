import React, { useEffect } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import Spinner from '../../component/spinner/Spinner';
import { useConnectionContext } from '../../contexts/ConnectionContext';
import ChatPanel from './chat-panel/ChatPanel';
import ConnectView from './connect-panel/ConnectPanel';
import WarningModal from './modal/WarningModal';
import SidePanel from './side-panel/SidePanel';

declare global {
  interface Window {
    randomAnimal: () => string;
  }
}

window.randomAnimal = window.randomAnimal || {};

interface RouteParams {
  hostId: string;
}

const HomePage = () => {
  const history = useHistory();

  const params = useParams<RouteParams>();
  const hostId = params?.hostId;

  const { connectionState, initiatePeer } = useConnectionContext();

  useEffect(() => {
    initiatePeer({ hostId });
  }, []);

  const { isLoading, peerId, isConnected } = connectionState;

  const onRejectTerms = () => {
    history.push('/');
    window.location.reload();
  };

  return (
    <div>
      {isLoading ? (
        <div className="container d-flex flex-column align-items-center justify-content-center">
          <Spinner />
          {hostId && (
            <div className="alert alert-info mx-auto mt-5">
              If connection take longer time to connect, then make sure webrtc
              settings in Browser is set to &quot;Use any suitable network
              interface&quot;
            </div>
          )}
        </div>
      ) : (
        <>
          {!hostId && peerId && !isConnected && <ConnectView peerId={peerId} />}
          {isConnected && (
            <div className="container d-flex">
              <WarningModal onRejectTerms={onRejectTerms} />
              <ChatPanel />
              <SidePanel />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
