import React, { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import Cookies from "js-cookie";
import { refreshSocket } from "util/apollo";
import { AuthContext, ChatContext } from "util/context";

const StateProvider = ({ initialToken, initialUserId, socket, children }) => {
  const client = useApolloClient();
  const [token, setToken] = useState(initialToken || Cookies.get("token"));
  const [userId, setUserId] = useState(initialUserId || Cookies.get("userId"));
  const [chatState, setChatState] = useState("default");

  // If the token changed (i.e. the user logged in
  // or out), clear the Apollo store and refresh the
  // websocket connection.
  useEffect(() => {
    if (!token) client.clearStore();
    if (socket) refreshSocket(socket);
  }, [client, socket, token]);

  const setAuth = (data) => {
    if (data) {
      const { id, token } = data;
      Cookies.set("token", token);
      Cookies.set("userId", id);
      setToken(token);
      setUserId(id);
    } else {
      Cookies.remove("token");
      Cookies.remove("userId");
      setToken(null);
      setUserId(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, userId, setAuth }}>
      <ChatContext.Provider value={{ chatState, setChatState }}>
        {children}
      </ChatContext.Provider>
    </AuthContext.Provider>
  );
};

export default StateProvider;
