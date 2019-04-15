# Socializer

Socializer is a basic social media web application to demonstrate Elixir + Phoenix + GraphQL + React + Apollo.

## Architecture

The backend is built on Elixir and Phoenix and exposes a GraphQL endpoint.

The client is bootstrapped with create-react-app. It uses React, React Router, and Apollo to query the Elixir GraphQL endpoint. It also uses server-side rendering (configuration largely lifted from [cra-ssr](https://github.com/cereallarceny/cra-ssr)).

## Setup

### Backend (GraphQL server powered by Phoenix)

1. Install Elixir via the means of your choice ([official docs](https://elixir-lang.org/install.html)).

2. Install dependencies with `mix deps.get`

3. Create and migrate the database with `mix ecto.setup`

4. Start Phoenix GraphQL endpoint with `mix phx.server`

The backend does not serve any HTML; it's just a GraphQL endpoint that is consumed by the client. You can also visit [localhost:4000/graphiql](http://localhost:4000/graphiql) for the interactive GraphiQL interface where you can write and test out GraphQL queries against the backend.

### Client

1. Install [node.js](https://nodejs.org/en/download/) and [yarn](https://yarnpkg.com/lang/en/docs/install/)

2. Install client dependencies: `yarn install`

3. Start the development server: `yarn start`. (Also ensure the Phoenix server is running -- see above)

4. Open [localhost:3000](http://localhost:3000) in your browser and you should see the application. It will automatically reload as you save changes to files.

## Deployment

### Backend

Coming soon...

### Client

1. Create a production build: `yarn build`

2. Start the SSR node server: `yarn serve`. This reads from the production build and serves fully hydrated HTML for each route.
