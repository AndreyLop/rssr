import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { renderRoutes } from "react-router-config";
import axios from "axios";

import Routes from "./Routes";
import reducers from "./reducers";

// Custom instance of axios for client will prepend api to requests to api
// This custom instance is used inside action creators
// But only for auth api calls for simple ajax just use axios
const axiosInstance = axios.create({
  baseURL: "/api"
});

//INITIAL_STATE is defined in the rendrer.js
const store = createStore(
  reducers,
  window.INITIAL_STATE,
  applyMiddleware(thunk.withExtraArgument(axiosInstance))
);

// hydrate means renew whats already tghere
// renderRoutes takes array of routes and creates markup
// its used cause of how routes for ssr is defined
ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <div>{renderRoutes(Routes)}</div>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
