import React, { useEffect, useState } from "react";
import "../pages/Soloplay.css"

function Countdown() {
  const [seconds, setSeconds] = React.useState(5);

  React.useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds('GO!');
    }
  });

  return (
    <div>
      <div class="countdown">
        {seconds}
      </div>
    </div>
  );
}

export default Countdown;