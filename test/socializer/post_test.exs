defmodule Socializer.PostTest do
  use SocializerWeb.ConnCase

  alias Socializer.Post

  describe "#all" do
    it "finds all posts" do
      post_a = insert(:post)
      post_b = insert(:post)
      results = Post.all()
      assert length(results) == 2
      assert List.first(results).id == post_b.id
      assert List.last(results).id == post_a.id
    end
  end

  describe "#find" do
    it "finds post" do
      post = insert(:post)
      found = Post.find(post.id)
      assert found.id == post.id
    end
  end

  describe "#create" do
    it "creates post" do
      user = insert(:user)
      valid_attrs = %{user_id: user.id, body: "New discussion"}
      {:ok, post} = Post.create(valid_attrs)
      assert post.body == "New discussion"
    end
  end

  describe "#changeset" do
    it "validates with correct attributes" do
      user = insert(:user)
      valid_attrs = %{user_id: user.id, body: "New discussion"}
      changeset = Post.changeset(%Post{}, valid_attrs)
      assert changeset.valid?
    end

    it "does not validate with missing attrs" do
      changeset =
        Post.changeset(
          %Post{},
          %{}
        )

      refute changeset.valid?
    end
  end
end
