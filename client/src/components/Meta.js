import React from "react";
import { Helmet } from "react-helmet";

const Meta = () => {
  return (
    <Helmet>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
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
      <meta property="og:url" content="https://socializer-demo.herokuapp.com" />
      <meta
        property="og:image"
        content="https://socializer-demo.herokuapp.com/og-image.jpg"
      />
    </Helmet>
  );
};

export default Meta;
