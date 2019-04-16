import React, { useState } from "react";
import { withApollo } from "react-apollo";
import { Switch, Route } from "react-router-dom";
import Cookies from "js-cookie";
import { Nav } from "components";
import { Chat, Home, Login, Post, Signup } from "pages";
import { AuthContext, ChatContext } from "util/context";

const App = ({ initialToken, client }) => {
  const [token, setToken] = useState(initialToken || Cookies.get("token"));
  const [userId, setUserId] = useState(Cookies.get("userId"));
  const [chatState, setChatState] = useState("default");

  const setAuth = (data) => {
    if (data) {
      const { id, token } = data;
      Cookies.set("token", token);
      Cookies.set("userId", id);
      setToken(token);
      setUserId(id);
    } else {
      client.clearStore();
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

export default withApollo(App);
