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

  def show(_parent, args, %{context: %{current_user: current_user}}) do
    case Conversation.find_for_user(args.id, current_user) do
      nil -> {:error, "Not found"}
      conversation -> {:ok, conversation}
    end
  end

  def show(_parent, _args, _resolutions) do
    {:error, "Unauthenticated"}
  end

  def create(_parent, args, %{
        context: %{current_user: current_user}
      }) do
    user_ids = (args[:user_ids] ++ [current_user.id]) |> Enum.uniq()

    # Check if there is already a conversation involving all these
    # users; if so, just return that.
    if existing = Conversation.find_for_users(user_ids) do
      {:ok, existing}
    else
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
  end

  def create(_parent, _args, _resolutions) do
    {:error, "Unauthenticated"}
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
