defmodule SocializerWeb.Resolvers.ConversationResolver do
  import Ecto.Query
  alias Ecto.Multi
  alias Socializer.{Repo, Conversation, ConversationUser, User}

  def list(_parent, _args, %{context: %{current_user: current_user}}) do
    {:ok, Conversation.all_for_user(current_user)}
  end

  def list(_parent, _args, _resolutions) do
    {:error, "Unauthenticated"}
  end

  def create(_parent, args, %{
        context: %{current_user: current_user}
      }) do
    user_ids = (args[:user_ids] ++ [current_user.id]) |> Enum.uniq()

    title =
      User
      |> where([u], u.id in ^user_ids)
      |> Repo.all()
      |> Enum.map(fn user -> user.name end)
      |> Enum.join(", ")

    multi =
      Multi.new()
      |> Multi.insert(
        :conversation,
        Conversation.changeset(%{title: title})
      )

    user_ids
    |> Enum.reduce(multi, fn user_id, multi ->
      multi_key = String.to_atom("conversation_user_" <> to_string(user_id))

      multi
      |> Multi.run(multi_key, fn repo,
                                 %{
                                   conversation: conversation
                                 } ->
        %{conversation_id: conversation.id, user_id: user_id}
        |> ConversationUser.changeset()
        |> repo.insert()
      end)
    end)
    |> Repo.transaction()
    |> case do
      {:ok, %{conversation: conversation}} ->
        {:ok, conversation}

      {:error, _model, changeset, _completed} ->
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
