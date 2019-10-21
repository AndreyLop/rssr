import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { renderRoutes } from "react-router-config";
import serialize from "serialize-javascript";
import Routes from "../client/Routes";
import { Helmet } from "react-helmet";

/*StaticRouter A <Router> that never changes location.
This can be useful in server-side rendering scenarios when the user isn't actually clicking around, so the location never actually changes. 
Hence, the name: static. It's also useful in simple tests when you just need to plug in a location and make assertions on the render output.*/

export default (req, store, context) => {
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} context={context}>
        <div>{renderRoutes(Routes)}</div>
      </StaticRouter>
    </Provider>
  );

  // A SEO optimization done for open graph (meta og) tags
  const helmet = Helmet.renderStatic();

  return `
    <html>
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      </head>
      <body>
        <div id="root">${content}</div>
        <script>
          window.INITIAL_STATE = ${serialize(store.getState())}
        </script>
        <script src="bundle.js"></script>
      </body>
    </html>
  `;
};
