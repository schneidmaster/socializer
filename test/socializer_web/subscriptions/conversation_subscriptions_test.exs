defmodule SocializerWeb.ConversationSubscriptionsTest do
  use SocializerWeb.SubscriptionCase

  describe "Conversation subscription" do
    it "updates on new conversation", %{socket: socket, user: user} do
      subscription_query = """
        subscription {
          conversationCreated {
            id
            title
          }
        }
      """

      ref = push_doc(socket, subscription_query)

      assert_reply(ref, :ok, %{subscriptionId: _subscription_id})

      other_user = insert(:user)

      create_conversation_mutation = """
        mutation CreateConversation {
          createConversation(userIds: ["#{other_user.id}"]) {
            id
            title
          }
        }
      """

      ref =
        push_doc(
          socket,
          create_conversation_mutation
        )

      assert_reply(ref, :ok, reply)
      data = reply.data["createConversation"]
      assert data["title"] == user.name <> ", " <> other_user.name

      assert_push("subscription:data", push)
      data = push.result.data["conversationCreated"]
      assert data["title"] == user.name <> ", " <> other_user.name
    end

    it "updates on updated conversation", %{socket: socket, user: user} do
      subscription_query = """
        subscription {
          conversationUpdated {
            id
            title
          }
        }
      """

      ref = push_doc(socket, subscription_query)

      assert_reply(ref, :ok, %{subscriptionId: _subscription_id})

      conversation = insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)

      create_message_mutation = """
        mutation CreateMessage {
          createMessage(conversationId: "#{conversation.id}", body: "Hello self") {
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
      assert data["body"] == "Hello self"

      assert_push("subscription:data", push)
      data = push.result.data["conversationUpdated"]
      assert data["id"] == to_string(conversation.id)
    end
  end
end
