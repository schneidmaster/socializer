import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import * as AbsintheSocket from "@absinthe/socket";
import { createAbsintheSocketLink } from "@absinthe/socket-apollo-link";
import { Socket as PhoenixSocket, LongPoll } from "phoenix";
import { createHttpLink } from "apollo-link-http";
import { hasSubscription } from "@jumpn/utils-graphql";
import { split } from "apollo-link";
import { setContext } from "apollo-link-context";
import Cookies from "js-cookie";

const HTTP_URI =
  process.env.NODE_ENV === "production"
    ? "https://brisk-hospitable-indianelephant.gigalixirapp.com"
    : "http://localhost:4000";

const WS_URI =
  process.env.NODE_ENV === "production"
    ? "wss://brisk-hospitable-indianelephant.gigalixirapp.com/socket"
    : "ws://localhost:4000/socket";

function createPhoenixSocket() {
  // Socket with full fallback to LongPoll
  // via https://elixirforum.com/t/fall-back-to-longpoll-when-websocket-fails/23894
  const socket = new PhoenixSocket(WS_URI, {
    params: () => {
      if (Cookies.get("token")) {
        return { token: Cookies.get("token") };
      } else {
        return {};
      }
    },
  });
  socket.onError(() => {
    if (navigator.onLine) {
      const isWebSocket = socket.transport === window.WebSocket;
      console.error(
        `Error connecting using ${isWebSocket ? "WebSocket" : "LongPoll"}`,
      );
      if (isWebSocket) socket.transport = LongPoll;
      else if (window.WebSocket) socket.transport = window.WebSocket;
    }
  });
  return socket;
}

export const createClient = ({ ssr, req, fetch, tokenCookie } = {}) => {
  let link = createHttpLink({ uri: HTTP_URI, fetch });
  let absintheSocket;

  if (!ssr) {
    absintheSocket = AbsintheSocket.create(createPhoenixSocket());
    const socketLink = createAbsintheSocketLink(absintheSocket);

    link = split(
      (operation) => hasSubscription(operation.query),
      socketLink,
      link,
    );
  }

  const authLink = setContext((_, { headers }) => {
    // Get the authentication token from the cookie if it exists.
    const token = tokenCookie || Cookies.get("token");

    // Return the headers to the context so httpLink can read them.
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const cache = new InMemoryCache();
  if (!ssr) {
    cache.restore(window.__APOLLO_STATE__);
  }

  const client = new ApolloClient({
    connectToDevTools: !ssr,
    ssrMode: ssr,
    link: authLink.concat(link),
    cache,
  });
  return { client, absintheSocket };
};

export const refreshSocket = (socket) => {
  // Close the connection to force a reconnection with the
  // new token parameter.
  socket.phoenixSocket.conn && socket.phoenixSocket.conn.close();
};
