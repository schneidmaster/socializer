[![CircleCI](https://circleci.com/gh/schneidmaster/socializer.svg?style=shield&circle-token=89ee7e9edcdafc99972d5811ed11176827ae3e3d)](https://circleci.com/gh/schneidmaster/socializer)

# Socializer

Socializer is a basic social media web application to demonstrate Elixir + Phoenix + GraphQL + React + Apollo. I also wrote an extensive blog post about building the application which you can read [here](https://schneider.dev/blog/elixir-phoenix-absinthe-graphql-react-apollo-absurdly-deep-dive).

## Architecture

The backend is built on Elixir and Phoenix and exposes a GraphQL endpoint.

The client is bootstrapped with create-react-app. It uses React, React Router, and Apollo to query the Elixir GraphQL endpoint. It also uses server-side rendering (configuration largely lifted from [cra-ssr](https://github.com/cereallarceny/cra-ssr)).

## Disclaimer

This is a toy app that I built to try out some technologies I found interesting. It is not suitable to be used in the real world -- for example, every user can message every other user without any limitations, which would obviously be ripe for spam and abuse.

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

### Procfile

The codebase also has a Procfile.dev which will run both the Elixir backend and the React frontend in development -- you can run it with `foreman -f Procfile.dev`.

## Deployment

A live demo is deployed to [https://socializer-demo.herokuapp.com/](https://socializer-demo.herokuapp.com/); the database is reset every night. I've also exposed the GraphiQL interface on Gigalixir [here](https://brisk-hospitable-indianelephant.gigalixirapp.com/graphiql) if you want to play around with some queries. (You should not expose GraphiQL on a real production app.)

### Backend

See the [Phoenix docs](https://hexdocs.pm/phoenix/deployment.html) for guidance on deploying a Phoenix app.

For the demo, the backend Phoenix/GraphQL app is running on [Gigalixir](https://gigalixir.com).

To deploy to your own Gigalixir account, follow these steps:

1. Install the [Gigalixir CLI](https://gigalixir.readthedocs.io/en/latest/main.html#install-the-command-line-interface) (if you don't have it already)

2. If you don't already have a Gigalixir app set up, create one: `gigalixir create`.

3. Create a free Postgres instance linked to your app: `gigalixir pg:create --free`

4. Deploy: `git push gigalixir master`

5. Run the database migrations (if this is the first deploy): `gigalixir run mix ecto.migrate`.

### Client

1. Create a production build: `yarn build`

2. Start the SSR node server: `yarn serve`. This reads from the production build and serves fully hydrated HTML for each route.

For the demo, the client express server is running on [Heroku](https://heroku.com). It is built and released as a Docker image.

To deploy to your own Heroku account, follow these steps:

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) (if you don't have it already)

2. `cd client`

3. Log into the Heroku container service: `heroku container:login`

4. If you don't already have a Heroku app set up, create one: `heroku create`

5. Build the image and push to the container registry: `heroku container:push web`

6. Release the image: `heroku container:release web`

You can also deploy the built Docker image to any other Docker hosting service of your choice.
