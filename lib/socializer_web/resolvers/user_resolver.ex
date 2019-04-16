defmodule SocializerWeb.Resolvers.UserResolver do
  alias Socializer.{Guardian, User}

  def search_users(_parent, args, %{context: %{current_user: current_user}}) do
    {:ok, User.search(args[:search_term], current_user)}
  end

  def search_users(_parent, _args, _resolutions) do
    {:error, "Unauthenticated"}
  end

  def current_user(_parent, _args, %{context: %{current_user: current_user}}) do
    {:ok, current_user}
  end

  def current_user(_parent, _args, _resolutions) do
    {:error, "Unauthenticated"}
  end

  def signup(_parent, args, _resolution) do
    args
    |> User.create()
    |> case do
      {:ok, user} ->
        {:ok, user_with_token(user)}

      {:error, changeset} ->
        {:error, extract_error_msg(changeset)}
    end
  end

  def authenticate(_parent, args, _resolution) do
    user = User.find_by(email: String.downcase(args[:email]))

    cond do
      user && Bcrypt.check_pass(user, args[:password]) ->
        {:ok, user_with_token(user)}

      true ->
        {:error, [[field: :email, message: "Invalid email or password"]]}
    end
  end

  defp user_with_token(user) do
    {:ok, token, _claims} = Guardian.encode_and_sign(user)
    Map.put(user, :token, token)
  end

  defp extract_error_msg(changeset) do
    changeset.errors
    |> Enum.map(fn {field, {error, _details}} ->
      [
        field: field,
        message: String.capitalize(error)
      ]
    end)
  end
end
