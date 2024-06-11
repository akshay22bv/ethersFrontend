import React, { useEffect } from "react";

const Test = () => {
  useEffect(() => {
    const socket = new WebSocket(
      "wss://api.kraken.com/public/Ticker?pair=BTC/USDC"
    );
    console.log("socket: ", socket);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      console.log("event: ", event);
      const newMessage = event.data;
      console.log("newMessage: ", newMessage);
      //   setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    // socket.onclose = () => {
    //   console.log("WebSocket connection closed");
    // };

    // return () => {
    //   socket.close();
    // };
  }, []);

  return <div>Test</div>;
};

export default Test;
