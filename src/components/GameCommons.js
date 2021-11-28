/**
 * Initializes connection with the backend server using websocket. 
 * 
 * @param {object} props - Component props
 * @param {string} props.gameId - game id
 * @param {string} props.link - the link used to send data to the backend (varies depending on the type of the game)
 * @param {object} props.stompClient - communicates with a stomp server using wss
 * @param {object} props.socket - websocket object
 * @param {function} props.setSessionId - sets session id for the player after it is recieved
 * @param {function} props.setGame - sets game after it is recieved
 * @param {function} props.setGameStatus - sets game status after it is recieved
 * @param {function} props.setServerError - sets server error if it is recieved
 */
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


/**
 * Processes each key typed by the player.  
 * 
 * @param {object} props - Component props
 * @param {object} props.event - key pressed event
 * @param {string} props.link - the link used to send data to the backend (varies depending on the type of the game)
 * @param {object} props.stompClient - communicates with a stomp server using wss
 * @param {array} props.gameText - an array containing characters of the game text
 * @param {string} props.localPosition - player's position client-side
 * @param {string} props.gameId - game id
 * @param {string} props.sessionId - player's session id
 * @param {string} props.textField - text field
 * @param {function} props.setDisconnectSeconds - set disconnect timer
 * @param {function} props.setError - sets the error
 * @param {function} props.setIncorrectCharCount - sets incorrect character count
 * @param {function} props.setTextField - sets text field
 * @param {function} props.setError - sets the error
 * @param {function} props.setLocalPosition - sets local position
 * @param {function} props.setLocalStatus - sets text field
 */
export const handleKey = ({event, link, incorrectCharCount, stompClient, gameText, localPosition, gameId, sessionId, textField, setDisconnectSeconds, setError, setIncorrectCharCount, setTextField, setLocalPosition, setLocalStatus}) => {
  const backspace = JSON.stringify('\b');
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

/**
 * Highlights each character based on whether it has already been successfully typed or whether it has been typed incorrectly. 
 * 
 * @param {object} props - Component props
 * @param {integer} props.idx - player's position
 * @param {object} props.gameStatus - stores game information and is updated only when game status is updated
 * @param {object} props.player - player
 */
export const positionIndicator = ({idx, gameStatus, player}) => {
  const styles = {
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none'
  }
  if (gameStatus.status !== "IN_PROGRESS" || !player) {
    return styles;
  }

  const position = player.position;
  if (idx < position) {
    styles['backgroundColor'] = "#5fb6e2";
  } else if (idx >= position && idx < position + player.incorrectCharacters.length) {
    styles['backgroundColor'] = "#ff9a9a";
  }
  return styles;
}