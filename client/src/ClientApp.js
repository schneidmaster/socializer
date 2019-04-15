import React, { useRef } from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import { createClient } from "util/apollo";
import App from "./App";

const ClientApp = () => {
  const client = useRef(createClient());

  return (
    <ApolloProvider client={client.current}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default ClientApp;
