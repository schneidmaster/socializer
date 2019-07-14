// Express requirements
import path from "path";
import fs from "fs";

// React requirements
import React from "react";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { StaticRouter } from "react-router";
import { ApolloProvider, getDataFromTree } from "@apollo/react-hooks";
import Loadable from "react-loadable";
import fetch from "node-fetch";

// Our store, entrypoint, and manifest
import App from "../src/App";
import { createClient } from "../src/util/apollo";
import manifest from "../build/asset-manifest.json";

const injectHTML = (data, { html, title, meta, body, scripts, state }) => {
  data = data.replace("<html>", `<html ${html}>`);
  data = data.replace(/<title>.*?<\/title>/g, title);
  data = data.replace("</head>", `${meta}</head>`);
  data = data.replace(
    '<div id="root"></div>',
    `<div id="root">${body}</div>
      <script>window.__APOLLO_STATE__=${state};</script>`,
  );
  data = data.replace("</body>", scripts.join("") + "</body>");

  return data;
};

export default (req, res) => {
  // Load in our HTML file from our build
  fs.readFile(
    path.resolve(__dirname, "../build/index.html"),
    "utf8",
    async (err, htmlData) => {
      // If there's an error... serve up something nasty
      if (err) {
        console.error("Read error", err);

        return res.status(404).end();
      }

      // Create Apollo client
      const { client } = createClient({
        req,
        fetch,
        ssr: true,
        tokenCookie: req.cookies.token,
      });

      const context = {};
      const modules = [];
      const ServerApp = (
        <Loadable.Capture report={(m) => modules.push(m)}>
          <ApolloProvider client={client}>
            <StaticRouter location={req.url} context={context}>
              <App
                initialToken={req.cookies.token}
                initialUserId={req.cookies.userId}
              />
            </StaticRouter>
          </ApolloProvider>
        </Loadable.Capture>
      );

      try {
        await getDataFromTree(ServerApp);
      } catch (e) {
        // Suppress -- the component will handle showing
        // an error message, so we still want to render it
        // rather than crashing.
      }

      const content = renderToString(ServerApp);

      if (context.url) {
        // If context has a url property, then we need to handle a redirection in Redux Router
        res.writeHead(302, {
          Location: context.url,
        });

        res.end();
      } else {
        // Otherwise, we carry on...

        // Let's give ourself a function to load all our page-specific JS assets for code splitting
        const extractAssets = (assets, chunks) =>
          Object.keys(assets)
            .filter((asset) => chunks.indexOf(asset.replace(".js", "")) > -1)
            .map((k) => assets[k]);

        // Let's format those assets into pretty <script> tags
        const extraChunks = extractAssets(manifest, modules).map(
          (c) =>
            `<script type="text/javascript" src="/${c.replace(
              /^\//,
              "",
            )}"></script>`,
        );

        // We need to tell Helmet to compute the right meta tags, title, and such
        const helmet = Helmet.renderStatic();

        // Pass all this nonsense into our HTML formatting function above
        const html = injectHTML(htmlData, {
          html: helmet.htmlAttributes.toString(),
          title: helmet.title.toString(),
          meta: helmet.meta.toString(),
          body: content,
          scripts: extraChunks,
          state: JSON.stringify(client.extract()).replace(/</g, "\\u003c"),
        });

        // We have all the final HTML, let's send it to the user already!
        res.send(html);
      }
    },
  );
};
