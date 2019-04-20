defmodule SocializerWeb.PostSubscriptionsTest do
  use SocializerWeb.SubscriptionCase

  describe "Post subscription" do
    it "updates on new post", %{socket: socket} do
      subscription_query = """
        subscription {
          postCreated {
            id
            body
          }
        }
      """

      ref = push_doc(socket, subscription_query)

      assert_reply(ref, :ok, %{subscriptionId: _subscription_id})

      create_post_mutation = """
        mutation CreatePost {
          createPost(body: "Big discussion") {
            id
            body
          }
        }
      """

      ref =
        push_doc(
          socket,
          create_post_mutation
        )

      assert_reply(ref, :ok, reply)
      data = reply.data["createPost"]
      assert data["body"] == "Big discussion"

      assert_push("subscription:data", push)
      data = push.result.data["postCreated"]
      assert data["body"] == "Big discussion"
    end
  end
end
