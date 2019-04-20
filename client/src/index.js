import React from "react";
import ReactDOM from "react-dom";
import ClientApp from "./ClientApp";

import "bootstrap/dist/css/bootstrap.css";

const mount =
  process.env.NODE_ENV === "production" ? ReactDOM.hydrate : ReactDOM.render;

mount(<ClientApp />, document.getElementById("root"));
