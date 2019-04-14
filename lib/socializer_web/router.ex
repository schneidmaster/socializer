defmodule SocializerWeb.Router do
  use SocializerWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", SocializerWeb do
    pipe_through :api
  end
end
