defmodule SocializerWeb.MessageSubscriptionsTest do
  use SocializerWeb.SubscriptionCase

  describe "Message subscription" do
    it "updates on new message", %{
      socket: socket,
      user: user
    } do
      conversation = insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)

      subscription_query = """
        subscription {
          messageCreated(conversationId: "#{conversation.id}") {
            id
            body
            user {
              id
              name
              gravatarMd5
            }
          }
        }
      """

      ref = push_doc(socket, subscription_query)

      assert_reply(ref, :ok, %{subscriptionId: _subscription_id})

      create_message_mutation = """
        mutation CreateMessage {
          createMessage(conversationId: "#{conversation.id}", body: "New thoughts") {
            id
            body
          }
        }
      """

      ref =
        push_doc(
          socket,
          create_message_mutation
        )

      assert_reply(ref, :ok, reply)
      data = reply.data["createMessage"]
      assert data["body"] == "New thoughts"

      assert_push("subscription:data", push)
      data = push.result.data["messageCreated"]
      assert data["body"] == "New thoughts"
    end
  end
end
