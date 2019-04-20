defmodule SocializerWeb.CommentSubscriptionsTest do
  use SocializerWeb.SubscriptionCase

  describe "Comment subscription" do
    it "updates on new comment", %{socket: socket} do
      post = insert(:post)

      subscription_query = """
        subscription {
          commentCreated(postId: "#{post.id}") {
            id
            body
          }
        }
      """

      ref = push_doc(socket, subscription_query)

      assert_reply(ref, :ok, %{subscriptionId: _subscription_id})

      create_comment_mutation = """
        mutation CreateComment {
          createComment(postId: "#{post.id}", body: "Some opinions") {
            id
            body
          }
        }
      """

      ref =
        push_doc(
          socket,
          create_comment_mutation
        )

      assert_reply(ref, :ok, reply)
      data = reply.data["createComment"]
      assert data["body"] == "Some opinions"

      assert_push("subscription:data", push)
      data = push.result.data["commentCreated"]
      assert data["body"] == "Some opinions"
    end
  end
end
