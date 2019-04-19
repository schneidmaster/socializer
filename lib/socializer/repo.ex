defmodule Socializer.Repo do
  use Ecto.Repo,
    otp_app: :socializer,
    adapter: Ecto.Adapters.Postgres
end
