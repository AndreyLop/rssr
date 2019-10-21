import "babel-polyfill";
import express from "express";
import { matchRoutes } from "react-router-config";
import proxy from "express-http-proxy";

import Routes from "./client/Routes";
import renderer from "./helpers/renderer";
import createStore from "./helpers/createStore";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
// Set up proxy
// Proxy is used to send auth requests to api server (heroku app in this case)
app.use(
  "/api",
  proxy("http://react-ssr-api.herokuapp.com", {
    proxyReqOptDecorator(opts) {
      opts.headers["x-forwarded-host"] = `localhost:${PORT}`;
      return opts;
    }
  })
);

app.get("*", (req, res) => {
  const store = createStore(req);

  // Get What components should be rendered
  // Also notice how you call route.loadData()!!!
  // loadData is just a function isnide component you get access to it using matchRoutes
  // All responses are dispatched to store!
  const promises = matchRoutes(Routes, req.path)
    .map(({ route }) => {
      return route.loadData ? route.loadData(store) : null;
    })
    // This shit is done cause promise all is gonna fail if one of requests is failed
    // So you wrap every promise call in promise call that call reslove on any case event catch block
    .map(promise => {
      if (promise) {
        return new Promise((res, rej) => {
          promise.then(res).catch(res);
        });
      }
    });

  Promise.all(promises).then(() => {
    // This context is available to all components
    const context = {};

    const content = renderer(req, store, context);

    // If url is present then redirect is in order
    // context.url will contain the URL to redirect to if a <Redirect> was used
    if (context.url) {
      return res.redirect(301, context.url);
    }

    // When NotFound is rendered it sets .notFound to true and we set 404 status
    if (context.notFound) {
      res.status(404);
    }

    res.send(content);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
