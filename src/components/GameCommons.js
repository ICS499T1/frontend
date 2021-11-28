
export const reinitializeConnection = ({gameId, link, stompClient, socket, setSessionId, setGame, setGameStatus, setServerError}) => {
    // Disables logs from stomp.js (used only for debugging)
    // stompClient.debug = () => {};
    stompClient.connect({ 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }, () => {
      var sessionId = /\/([^/]+)\/websocket/.exec(socket._transport.url)[1];
      setSessionId(sessionId);

      // Subscription for game events
      stompClient.subscribe(link + '/gameplay/' + gameId, (game) => {
        var result = JSON.parse(game.body);
        setGame(result);
      });

      // Subscription for syncing client-side game status with server-side game status
      stompClient.subscribe(link + '/status/' + gameId, (gameStatus) => {
        var statusResult = JSON.parse(gameStatus.body);
        setGameStatus(statusResult);
      });

      // Subscription for exceptions thrown serverside
      stompClient.subscribe(link + '/errors/' + gameId + '/' + sessionId, (backendError) => {
        setServerError(backendError.body);
      });

    }, (error) => console.log(error));
}

export const handleKey = ({event, link, backspace, incorrectCharCount, stompClient, gameText, localPosition, gameId, sessionId, textField, setDisconnectSeconds, setError, setIncorrectCharCount, setTextField, setLocalPosition, setLocalStatus}) => {
  setDisconnectSeconds(90);
  var key = event.key;
  var keyCode = event.keyCode;

  if (keyCode !== 8 && keyCode !== 32 && key.length > 1) {
    return;
  }
  
  if (incorrectCharCount > 5 && keyCode !== 8) {
    event.preventDefault();
    setError(true);
    return;
  }

  if (incorrectCharCount !== 0) {
    // Backspace
    if (keyCode === 8) {
      stompClient.send('/app' + link + '/' + gameId + '/' + sessionId, {}, backspace);
      setIncorrectCharCount(incorrectCharCount - 1);
      setTextField(textField.slice(0, -1));            
      setError(false);
    } else {
      stompClient.send('/app' + link + '/' + gameId + '/' + sessionId, {}, JSON.stringify(key));
      setIncorrectCharCount(incorrectCharCount + 1);
      setTextField(textField + key);
    }
  } else if (keyCode === 8) {
    event.preventDefault();
  } else if (gameText[localPosition] === key) {
    stompClient.send('/app' + link + '/' + gameId + '/' + sessionId, {}, JSON.stringify(key));
    setLocalPosition(localPosition + 1);

    if (gameText.length - 1 === localPosition) {
      setLocalStatus("READY");
      setTextField('');
      setLocalPosition(0);
      setIncorrectCharCount(0);
      return;
    }
    // Spacebar
    if (keyCode === 32) {
      setTextField('');
    } else {
      setTextField(textField + key);
    }
  } else {
    stompClient.send('/app' + link + '/' + gameId + '/' + sessionId, {}, JSON.stringify(key));
    setIncorrectCharCount(incorrectCharCount + 1);
    setTextField(textField + key);
  }
}