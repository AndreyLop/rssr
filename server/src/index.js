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
  // All responses are dispatched to store!
  const promises = matchRoutes(Routes, req.path).map(({ route }) => {
    return route.loadData ? route.loadData(store) : null;
  });

  Promise.all(promises).then(() => {
    // This context is available to all components
    // When NotFound is rendered it sets .notFound to true and we set 404 status
    const context = {};

    const content = renderer(req, store, context);

    if (context.notFound) {
      res.status(404);
    }

    res.send(content);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
