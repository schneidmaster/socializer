defmodule SocializerWeb.Resolvers.MessageResolver do
  alias Ecto.Multi
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
    case Conversation.find_for_user(args[:conversation_id], current_user) do
      nil ->
        {:error, "Unauthenticated"}

      conversation ->
        Multi.new()
        |> Multi.insert(
          :message,
          Message.changeset(args |> Map.put(:user_id, current_user.id))
        )
        |> Multi.update(
          :conversation,
          Conversation.changeset(conversation, %{updated_at: DateTime.utc_now()})
        )
        |> Repo.transaction()
        |> case do
          {:ok, %{message: message}} ->
            {:ok, message}

          {:error, _model, changeset, _completed} ->
            {:error, extract_error_msg(changeset)}
        end
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
