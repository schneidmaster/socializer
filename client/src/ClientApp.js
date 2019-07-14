import React, { useRef } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { BrowserRouter } from "react-router-dom";
import { createClient } from "util/apollo";
import App from "./App";

const ClientApp = () => {
  const client = useRef(createClient());

  return (
    <ApolloProvider client={client.current.client}>
      <BrowserRouter>
        <App socket={client.current.absintheSocket} />
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default ClientApp;
