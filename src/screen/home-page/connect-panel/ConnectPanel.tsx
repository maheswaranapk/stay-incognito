import React, { useRef } from 'react';

import Credit from '../../../component/credit/Credit';
import './ConnectPanel.scss';

const Feature = ({ text, icon, className = '' }) => (
  <div className={`col-6 ${className}`}>
    <div className="feature my-4 mx-auto">
      <div className="feature-icon mx-auto">
        <i className={icon} />
      </div>
      <div className="fetaure-text">{text}</div>
    </div>
  </div>
);

const ConnectPanel = ({ peerId }) => {
  const hostURLInputRef = useRef<HTMLInputElement>(null);

  const copyToClipBoard = () => {
    if (hostURLInputRef?.current) {
      const dummy = document.createElement('textarea');
      document.body.appendChild(dummy);
      dummy.value = hostURLInputRef?.current.value;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
    }
  };
  return (
    <>
      <div className="d-none d-xl-block connect-panel container-fluid h-100">
        <div className="container row h-100 mx-auto">
          <div className="col-6 d-flex flex-column align-items-start justify-content-between">
            <div />
            <div>
              <div className="title mb-2">Stay Incognito (Beta)</div>
              <div className="sub-title mb-2">
                Simple peer to peer incognito chat
              </div>
              <div className="mb-2 mt-1 w-100 input-message">
                Copy and share below address to your partner to connect.
              </div>

              <div className="input-group mb-2">
                <input
                  aria-describedby="basic-addon2"
                  className="form-control border border-primary"
                  disabled
                  ref={hostURLInputRef}
                  type="text"
                  value={`${window.location.href}host/${peerId}`}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-primary"
                    onClick={copyToClipBoard}
                    type="button"
                  >
                    Copy
                  </button>
                </div>
                <div className="w-100 mt-2 input-message input-message-hint">
                  (You will get redirected once your partner opened the link)
                </div>
              </div>
            </div>
            <Credit />
          </div>
          <div className="col-6 feature-panel d-flex flex-column justify-content-center">
            <div className="row">
              <Feature icon="fas fa-magic" text="100% Free" />

              <Feature icon="fas fa-user-secret" text="NO Login required" />
              <Feature icon="fas fa-file" text="File Sharing" />
              <Feature icon="fab fa-github" text="Open Source" />
              <Feature
                className="col-12"
                icon="fas fa-database"
                text="No Data saved in Server"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container d-flex  d-xl-none flex-column align-items-center justify-content-center">
        <div className="card connect-panel-mobile">
          <div className="card-body d-flex flex-column align-items-center justify-content-center">
            <div className="title mb-1">Stay Incognito (Beta)</div>
            <div className="sub-title mb-4">
              Simple peer to peer incognito chat
            </div>
            <div className="mb-2 mr-5 mt-1 input-message">
              Copy and send below address to your friend to connect.
              <br />
              (You will get redirected once your partner opened the link)
            </div>

            <div className="input-group mb-2">
              <input
                aria-describedby="basic-addon2"
                className="form-control border border-primary"
                disabled
                id="host-url"
                type="text"
                value={`${window.location.href}host/${peerId}`}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-primary"
                  onClick={copyToClipBoard}
                  type="button"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="note mb-5">
              {/* (we don't store anything in our server.) */}
            </div>
            <Credit />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectPanel;
