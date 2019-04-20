defmodule SocializerWeb.Router do
  use Phoenix.Router

  pipeline :api do
    plug SocializerWeb.Context
    plug :accepts, ["json"]
  end

  scope "/" do
    pipe_through :api

    forward "/graphiql", Absinthe.Plug.GraphiQL, schema: SocializerWeb.Schema

    forward "/", Absinthe.Plug, schema: SocializerWeb.Schema
  end
end
