import React, { Fragment } from 'react';

import Peer from 'peerjs';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import confirmModal from '../../component/confirm-modal/ConfirmModal';
import Spinner from '../../component/spinner/Spinner';
import * as messageTypes from '../../constants/message.constant';
import { CONFIG } from '../../constants/peer.config.constant';
import chatActions from '../../store/actions/chat.action';
import peerActions from '../../store/actions/peer.action';
import ChatPanel from './chat-panel/ChatPanel';
import ConnectView from './connect-panel/ConnectPanel';
import WarningModal from './modal/WarningModal';
import SidePanel from './side-panel/SidePanel';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    let hostId = null;
    hostId =
      props.match && props.match.params && props.match.params.hostId
        ? props.match.params.hostId
        : null;
    this.props.actions.setHostId({ hostId });

    this.peer = new Peer(CONFIG);
    this.conn = null;
  }

  componentDidMount() {
    this.peer.on('open', (id) => {
      const { hostId } = this.props;
      if (hostId) {
        this.initializeConnection();
      } else {
        this.props.actions.setPeerId({ peerId: this.peer.id });
      }
    });

    this.peer.on('connection', (conn) => {
      this.conn = conn;
      this.initializeConnection();
    });

    this.peer.on('close', this.connectionLost);
    this.peer.on('error', this.connectionLost);
    this.peer.on('disconnected', this.connectionLost);
    window.addEventListener('beforeunload', this.disconnectConnection);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.disconnectConnection);
  }

  initializeConnection = () => {
    const { hostId } = this.props;
    if (hostId) this.conn = this.peer.connect(hostId);

    this.conn.on('open', () => {
      if (hostId) {
        const hostName = window.randomAnimal();
        let myName = window.randomAnimal();

        while (hostName === myName) myName = window.randomAnimal();

        this.props.actions.setName({ myName, partnerName: hostName });
        this.conn.send({
          type: messageTypes.MSG_TYPE_SET_NAME,
          hostName,
          partnerName: myName,
        });
        this.props.actions.setName({ myName, partnerName: hostName });
        this.conn.send({
          type: messageTypes.MSG_TYPE_INFO,
          data: `You(${hostName}) are connected to you Partner(${myName})`,
        });
        this.props.actions.setInfo(
          `You(${myName}) are connected to you Partner(${hostName})`,
        );
      }

      this.props.actions.connectionEstablished({
        connectionId: this.conn.peer,
      });

      // Receive messages
      this.conn.on('data', (data) => {
        console.log(data);
        this.onReceive(data);
      });
      this.conn.on('close', this.connectionLost);
      this.conn.on('error', this.connectionLost);
      this.conn.on('disconnected', this.connectionLost);
    });
  };

  disconnectConnection = (event) => {
    event.preventDefault();
    if (this.peer) this.peer.destroy();
  };

  connectionLost = async () => {
    await confirmModal({
      title: 'Connection lost',
      message: 'Reconnect with your partner with new link.',
      onlyOkButton: true,
    });
    this.props.history.push('/');
    window.location.reload();
  };

  onRejectTerms = () => {
    this.props.history.push('/');
    window.location.reload();
  };

  onReceive = (data) => {
    switch (data.type) {
      case messageTypes.MSG_TYPE_FILE_RECEIVED:
        this.props.actions.receiveFile(data.data);
        break;
      case messageTypes.MSG_TYPE_INFO:
        this.props.actions.setInfo(data.data);
        break;
      case messageTypes.MSG_TYPE_SET_NAME:
        this.props.actions.setName({
          myName: data.hostName,
          partnerName: data.partnerName,
        });
        break;
      case messageTypes.MSG_TYPE_MSG:
        this.props.actions.receiveMessage(data.data);
        break;
      default:
        break;
    }
  };

  connectionSent = (data) => {
    if (this.conn && this.conn.open) this.conn.send(data);
  };

  onClick = () => {
    const filePicker = document.getElementById('file-picker');
    if (filePicker) filePicker.click();
  };

  handleChange = (event) => {
    const file = event.target.files[0];
    const blob = new Blob(event.target.files, { type: file.type });
    this.conn.send({
      file: blob,
      filename: file.name,
      filetype: file.type,
    });
  };

  render() {
    const { isLoading, isHost, peerId, isConnected } = this.props;
    return (
      <>
        {isLoading ? (
          <div className="container d-flex flex-column align-items-center justify-content-center">
            <Spinner />
            {isHost && (
              <div className="alert alert-info mx-auto mt-5">
                If connection take longer time to connect, then make sure webrtc
                settings in Browser is set to "Use any suitable network
                interface"
              </div>
            )}
          </div>
        ) : (
          <>
            {!isHost && peerId && !isConnected && (
              <ConnectView peerId={peerId} />
            )}
            {isConnected && (
              <div className="container d-flex">
                <WarningModal onRejectTerms={this.onRejectTerms} />
                <ChatPanel
                  conn={this.conn}
                  connectionSent={this.connectionSent}
                />
                <SidePanel />
              </div>
            )}
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.peerReducer.isLoading,
  isConnected: state.peerReducer.isConnected,
  isHost: state.peerReducer.isHost,
  hostId: state.peerReducer.hostId,
  peerId: state.peerReducer.peerId,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      connectionEstablished: peerActions.connectionEstablished,
      setHostId: peerActions.setHostId,
      setPeerId: peerActions.setPeerId,
      setName: peerActions.setName,
      receiveMessage: chatActions.receiveMessage,
      sendMessage: chatActions.sendMessage,
      setInfo: chatActions.setInfo,
      receiveFile: chatActions.receiveFile,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(HomePage));
