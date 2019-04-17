defmodule SocializerWeb.PostResolverTest do
  use SocializerWeb.ConnCase

  alias SocializerWeb.Resolvers.PostResolver

  describe "#list" do
    it "returns posts" do
      post_a = insert(:post)
      post_b = insert(:post)
      {:ok, results} = PostResolver.list(nil, nil, nil)
      assert length(results) == 2
      assert List.first(results).id == post_b.id
      assert List.last(results).id == post_a.id
    end
  end

  describe "#show" do
    it "returns specific post" do
      post = insert(:post)
      {:ok, found} = PostResolver.show(nil, %{id: post.id}, nil)
      assert found.id == post.id
    end

    it "returns not found when post does not exist" do
      {:error, error} = PostResolver.show(nil, %{id: 1}, nil)
      assert error == "Not found"
    end
  end

  describe "#create" do
    it "creates valid post with authenticated user" do
      user = insert(:user)

      {:ok, post} =
        PostResolver.create(nil, %{body: "Hello"}, %{
          context: %{current_user: user}
        })

      assert post.body == "Hello"
      assert post.user_id == user.id
    end

    it "returns error for missing params" do
      user = insert(:user)

      {:error, error} =
        PostResolver.create(nil, %{}, %{
          context: %{current_user: user}
        })

      assert error == [[field: :body, message: "Can't be blank"]]
    end

    it "returns error for unauthenticated user" do
      {:error, error} = PostResolver.create(nil, %{body: "Hello"}, nil)

      assert error == "Unauthenticated"
    end
  end
end
