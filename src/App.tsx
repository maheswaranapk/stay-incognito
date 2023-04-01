import React, { useEffect } from 'react';

import { Route, Switch, useHistory } from 'react-router-dom';

import './App.scss';
import confirmModal from './component/confirm-modal/ConfirmModal';
import { ChatStateContextProvider } from './contexts/ChatContext';
import { ConnectionProvider } from './contexts/ConnectionContext';
import HomePage from './screen/home-page/HomePage';

const NotFound = () => <div>Not Found</div>;

const App = () => {
  const history = useHistory();

  const setCustomVaraibleVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  useEffect(() => {
    window.addEventListener('resize', setCustomVaraibleVh);
    return () => {
      window.removeEventListener('resize', setCustomVaraibleVh);
    };
  }, []);

  const onConnectionLost = async () => {
    await confirmModal({
      message: 'Reconnect with your partner with new link.',
      onlyOkButton: true,
      title: `Connection lost`,
    });
    history.push('/');
    window.location.reload();
  };

  return (
    <div className="App">
      <ChatStateContextProvider>
        <ConnectionProvider onConnectionLost={onConnectionLost}>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/host/:hostId">
              <HomePage />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </ConnectionProvider>
      </ChatStateContextProvider>
    </div>
  );
};

export default App;
