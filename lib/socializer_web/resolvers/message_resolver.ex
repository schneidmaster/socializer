defmodule SocializerWeb.Resolvers.MessageResolver do
  alias Socializer.{Repo, Conversation, Message}

  def list(_parent, args, _resolutions) do
    conversation =
      args[:conversation_id]
      |> Conversation.find()
      |> Repo.preload(:messages)

    {:ok, conversation.messages}
  end

  def create(_parent, args, %{
        context: %{current_user: current_user}
      }) do
    args
    |> Map.put(:user_id, current_user.id)
    |> Message.create()
    |> case do
      {:ok, message} ->
        {:ok, message}

      {:error, changeset} ->
        {:error, extract_error_msg(changeset)}
    end
  end

  def create(_parent, _args, _resolutions) do
    {:error, "Unauthenticated"}
  end

  defp extract_error_msg(changeset) do
    changeset.errors
    |> Enum.map(fn {field, {error, _details}} ->
      String.capitalize(to_string(field)) <> " " <> error
    end)
    |> Enum.join("; ")
  end
end
