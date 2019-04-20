import React, { Fragment, useEffect, useRef, useState } from "react";
import { withApollo } from "react-apollo";
import { Switch, Route } from "react-router-dom";
import Cookies from "js-cookie";
import { Meta, Nav } from "components";
import { Chat, Home, Login, Post, Signup } from "pages";
import { refreshSocket } from "util/apollo";
import { AuthContext, ChatContext } from "util/context";

const App = ({ initialToken, initialUserId, client, socket }) => {
  const [token, setToken] = useState(initialToken || Cookies.get("token"));
  const [userId, setUserId] = useState(initialUserId || Cookies.get("userId"));
  const [chatState, setChatState] = useState("default");
  const tokenWas = useRef(token);

  // If the token changed (i.e. the user logged in
  // or out), clear the Apollo store and refresh the
  // websocket connection.
  useEffect(() => {
    if (tokenWas.current !== token) {
      client.clearStore();
      if (socket) refreshSocket(socket);
      tokenWas.current = token;
    }
  }, [token]);

  const setAuth = async (data) => {
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
        <Nav />

        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/posts/:id" component={Post} />
          <Route path="/chat/:id?" component={Chat} />
          <Route component={Home} />
        </Switch>
      </ChatContext.Provider>
    </AuthContext.Provider>
  );
};

// This is hoisted to a separate component
// because react-helmet has a bug that
// causes it to go into an infinite loop
// when rendered adjacent to useEffect.
// https://github.com/nfl/react-helmet/issues/437
const AppWithMeta = (props) => {
  return (
    <Fragment>
      <Meta />
      <App {...props} />
    </Fragment>
  );
};

export default withApollo(AppWithMeta);
