defmodule SocializerWeb.CommentResolverTest do
  use SocializerWeb.ConnCase

  alias SocializerWeb.Resolvers.CommentResolver

  describe "#list" do
    it "returns comments for a post" do
      post = insert(:post)
      comment_a = insert(:comment, post: post)
      comment_b = insert(:comment, post: post)
      {:ok, results} = CommentResolver.list(nil, %{post_id: post.id}, nil)
      assert length(results) == 2
      assert List.first(results).id == comment_a.id
      assert List.last(results).id == comment_b.id
    end
  end

  describe "#create" do
    it "creates valid comment with authenticated user" do
      post = insert(:post)
      user = insert(:user)

      {:ok, comment} =
        CommentResolver.create(nil, %{post_id: post.id, body: "Hello"}, %{
          context: %{current_user: user}
        })

      assert comment.body == "Hello"
      assert comment.post_id == post.id
      assert comment.user_id == user.id
    end

    it "returns error for missing params" do
      post = insert(:post)
      user = insert(:user)

      {:error, error} =
        CommentResolver.create(nil, %{post_id: post.id}, %{
          context: %{current_user: user}
        })

      assert error == [[field: :body, message: "Can't be blank"]]
    end

    it "returns error for unauthenticated user" do
      post = insert(:post)

      {:error, error} = CommentResolver.create(nil, %{post_id: post.id, body: "Hello"}, nil)

      assert error == "Unauthenticated"
    end
  end
end
