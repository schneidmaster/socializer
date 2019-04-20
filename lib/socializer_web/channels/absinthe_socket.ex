defmodule SocializerWeb.AbsintheSocket do
  use Phoenix.Socket
  use Absinthe.Phoenix.Socket, schema: SocializerWeb.Schema

  alias Absinthe.Phoenix.Socket
  alias Socializer.{Guardian, User}

  def connect(%{"token" => token}, socket) do
    with {:ok, claim} <- Guardian.decode_and_verify(token),
         user when not is_nil(user) <- User.find(claim["sub"]) do
      socket = Socket.put_options(socket, context: %{current_user: user})
      {:ok, socket}
    else
      _ -> {:ok, socket}
    end
  end

  def connect(_, socket) do
    {:ok, socket}
  end

  def id(%{assigns: %{absinthe: %{opts: [context: %{current_user: user}]}}}) do
    "absinthe_socket:#{user.id}"
  end

  def id(_), do: nil
end
