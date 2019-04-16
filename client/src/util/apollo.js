import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import * as AbsintheSocket from "@absinthe/socket";
import { createAbsintheSocketLink } from "@absinthe/socket-apollo-link";
import { Socket as PhoenixSocket } from "phoenix";
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

export const createClient = ({ ssr, req, fetch, tokenCookie } = {}) => {
  let link = createHttpLink({ uri: HTTP_URI, fetch });

  if (!ssr) {
    const socketLink = createAbsintheSocketLink(
      AbsintheSocket.create(new PhoenixSocket(WS_URI)),
    );

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

  return new ApolloClient({
    connectToDevTools: !ssr,
    ssrMode: ssr,
    link: authLink.concat(link),
    cache: new InMemoryCache(),
  });
};
