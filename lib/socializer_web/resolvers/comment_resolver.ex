defmodule SocializerWeb.Resolvers.CommentResolver do
  alias Socializer.{Repo, Comment, Post}

  def list(_parent, args, _resolutions) do
    post =
      args[:post_id]
      |> Post.find()
      |> Repo.preload(:comments)

    {:ok, post.comments}
  end

  def create(_parent, args, %{
        context: %{current_user: current_user}
      }) do
    args
    |> Map.put(:user_id, current_user.id)
    |> Comment.create()
    |> case do
      {:ok, comment} ->
        {:ok, comment}

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
      [
        field: field,
        message: String.capitalize(error)
      ]
    end)
  end
end
