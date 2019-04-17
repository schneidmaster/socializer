import React, { Fragment, useState } from "react";
import { withApollo } from "react-apollo";
import Helmet from "react-helmet";
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
    <Fragment>
      <Helmet>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#007bff" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="628" />
        <meta
          property="og:description"
          content="Socialization. Now on the Internet."
        />
        <meta property="og:title" content="Socializer" />
        <meta
          property="og:url"
          content="https://socializer-demo.herokuapp.com"
        />
        <meta
          property="og:image"
          content="https://socializer-demo.herokuapp.com/og-image.jpg"
        />
      </Helmet>

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
    </Fragment>
  );
};

export default withApollo(App);
