defmodule Socializer.CommentTest do
  use SocializerWeb.ConnCase

  alias Socializer.Comment

  describe "#create" do
    it "creates comment" do
      post = insert(:post)
      user = insert(:user)
      valid_attrs = %{post_id: post.id, user_id: user.id, body: "My thoughts"}
      {:ok, comment} = Comment.create(valid_attrs)
      assert comment.body == "My thoughts"
    end
  end

  describe "#changeset" do
    it "validates with correct attributes" do
      post = insert(:post)
      user = insert(:user)
      valid_attrs = %{post_id: post.id, user_id: user.id, body: "My thoughts"}
      changeset = Comment.changeset(%Comment{}, valid_attrs)
      assert changeset.valid?
    end

    it "does not validate with missing attrs" do
      changeset =
        Comment.changeset(
          %Comment{},
          %{}
        )

      refute changeset.valid?
    end
  end
end
