import React, { useState } from "react";
import { withApollo } from "react-apollo";
import { Switch, Route } from "react-router-dom";
import Cookies from "js-cookie";
import { Nav } from "components";
import { Home, Login, Post, Signup } from "pages";
import AuthContext from "util/authContext";

const App = ({ initialToken, client }) => {
  const [token, setToken] = useState(initialToken || Cookies.get("token"));

  const setAuth = (token) => {
    if (token) {
      Cookies.set("token", token);
    } else {
      client.current.clearStore();
      Cookies.remove("token");
    }
    setToken(token);
  };

  return (
    <AuthContext.Provider value={{ token, setAuth }}>
      <Nav />

      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/posts/:id" component={Post} />
        <Route component={Home} />
      </Switch>
    </AuthContext.Provider>
  );
};

export default withApollo(App);
