import React from "react";
import { Switch, Route } from "react-router-dom";
import { Meta, Nav } from "components";
import { StateProvider } from "containers";
import { Chat, Home, Login, Post, Signup } from "pages";
import "./App.css";

const App = (props) => {
  return (
    <StateProvider {...props}>
      <Meta />
      <Nav />

      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/posts/:id" component={Post} />
        <Route path="/chat/:id?" component={Chat} />
        <Route component={Home} />
      </Switch>
    </StateProvider>
  );
};

export default App;
