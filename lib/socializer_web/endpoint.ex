defmodule SocializerWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :socializer

  socket "/socket", SocializerWeb.UserSocket,
    websocket: true,
    longpoll: true

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug CORSPlug

  plug SocializerWeb.Router
end
