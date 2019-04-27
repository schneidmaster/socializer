use Mix.Config

# Do not print debug messages in production
config :logger, level: :info

config :socializer, SocializerWeb.Endpoint,
  http: [port: System.get_env("PORT")],
  url: [host: System.get_env("APP_NAME") <> ".gigalixirapp.com", port: 80],
  secret_key_base: Map.fetch!(System.get_env(), "SECRET_KEY_BASE"),
  server: true,
  check_origin: ["https://socializer-demo.herokuapp.com"]

config :socializer, Socializer.Repo,
  adapter: Ecto.Adapters.Postgres,
  url: System.get_env("DATABASE_URL"),
  database: "",
  ssl: true,
  pool_size: 2

config :socializer, Socializer.Scheduler,
  timezone: "America/New_York",
  jobs: [
    {"@weekly", {Socializer.DemoManager, :reset_and_seed_database!, []}}
  ]
