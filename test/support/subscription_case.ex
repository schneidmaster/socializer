defmodule SocializerWeb.SubscriptionCase do
  use ExUnit.CaseTemplate

  alias Socializer.Guardian

  using do
    quote do
      use SocializerWeb.ChannelCase
      use Absinthe.Phoenix.SubscriptionTest, schema: SocializerWeb.Schema
      use ExSpec
      import Socializer.Factory

      setup do
        user = insert(:user)

        # When connecting to a socket, if you pass a token we will set the context's `current_user`
        params = %{
          "token" => sign_auth_token(user)
        }

        {:ok, socket} = Phoenix.ChannelTest.connect(SocializerWeb.AbsintheSocket, params)
        {:ok, socket} = Absinthe.Phoenix.SubscriptionTest.join_absinthe(socket)

        {:ok, socket: socket, user: user}
      end

      defp sign_auth_token(user) do
        {:ok, token, _claims} = Guardian.encode_and_sign(user)
        token
      end
    end
  end
end
