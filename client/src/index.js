import React from "react";
import ReactDOM from "react-dom";
import ClientApp from "./ClientApp";

import "bootstrap/dist/css/bootstrap.css";

ReactDOM.hydrate(<ClientApp />, document.getElementById("root"));
