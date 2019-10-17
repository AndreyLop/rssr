import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import Routes from "./Routes";

const history = createBrowserHistory();

ReactDOM.hydrate(
  <Router history={history}>
    <Routes />
  </Router>,
  document.getElementById("root")
);
