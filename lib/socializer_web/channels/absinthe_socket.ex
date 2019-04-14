defmodule SocializerWeb.AbsintheSocket do
  use Phoenix.Socket
  use Absinthe.Phoenix.Socket, schema: SocializerWeb.Schema

  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  # Returning `nil` makes this socket anonymous.
  def id(_socket), do: nil
end
