defmodule SocializerWeb.AbsintheSocket do
  use Phoenix.Socket
  use Absinthe.Phoenix.Socket, schema: SocializerWeb.Schema

  origin =
    case Mix.env() do
      :prod -> ["https://socializer-demo.herokuapp.com"]
      _ -> false
    end

  transport(:websocket, Phoenix.Transports.WebSocket,
    timeout: 45_000,
    check_origin: origin
  )

  transport(:longpoll, Phoenix.Transports.LongPoll)

  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  # Returning `nil` makes this socket anonymous.
  def id(_socket), do: nil
end
