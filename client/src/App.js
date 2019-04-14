import React, { useRef, useState } from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Cookies from "js-cookie";
import { Nav } from "components";
import { Home, Login, Signup } from "pages";
import { createClient } from "util/apollo";
import AuthContext from "util/authContext";

const App = () => {
  const client = useRef(createClient());
  const [token, setToken] = useState(Cookies.get("token"));

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
    <ApolloProvider client={client.current}>
      <AuthContext.Provider value={{ token, setAuth }}>
        <BrowserRouter>
          <Nav />

          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route component={Home} />
          </Switch>
        </BrowserRouter>
      </AuthContext.Provider>
    </ApolloProvider>
  );
};

export default App;
