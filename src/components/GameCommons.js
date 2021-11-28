
export const reinitializeConnection = ({gameId, link, stompClient, socket, setSessionId, setGame, setGameStatus, setServerError}) => {
    // Disables logs from stomp.js (used only for debugging)
    stompClient.debug = () => {};
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