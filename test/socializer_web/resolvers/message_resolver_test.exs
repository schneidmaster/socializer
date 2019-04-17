defmodule SocializerWeb.MessageResolverTest do
  use SocializerWeb.ConnCase

  alias SocializerWeb.Resolvers.MessageResolver

  describe "#list" do
    it "returns messages for a conversation" do
      conversation = insert(:conversation)
      user = insert(:user)
      insert(:conversation_user, conversation: conversation, user: user)
      message_a = insert(:message, conversation: conversation, user: user)
      message_b = insert(:message, conversation: conversation, user: user)

      {:ok, results} =
        MessageResolver.list(nil, %{conversation_id: conversation.id}, %{
          context: %{current_user: user}
        })

      assert length(results) == 2
      assert List.first(results).id == message_a.id
      assert List.last(results).id == message_b.id
    end

    it "returns not found when user is not in conversation" do
      conversation = insert(:conversation)
      user = insert(:user)
      insert(:message, conversation: conversation, user: user)
      insert(:message, conversation: conversation, user: user)

      {:error, error} =
        MessageResolver.list(nil, %{conversation_id: conversation.id}, %{
          context: %{current_user: user}
        })

      assert error == "Not found"
    end

    it "returns not found when conversation does not exist" do
      user = insert(:user)

      {:error, error} =
        MessageResolver.list(nil, %{conversation_id: -1}, %{context: %{current_user: user}})

      assert error == "Not found"
    end

    it "returns unauthenticated with no current user" do
      conversation = insert(:conversation)
      {:error, error} = MessageResolver.list(nil, %{conversation_id: conversation.id}, nil)

      assert error == "Unauthenticated"
    end
  end

  describe "#create" do
    it "creates valid message with authenticated user" do
      conversation = insert(:conversation)
      user = insert(:user)
      insert(:conversation_user, conversation: conversation, user: user)

      {:ok, message} =
        MessageResolver.create(nil, %{conversation_id: conversation.id, body: "Hello"}, %{
          context: %{current_user: user}
        })

      assert message.body == "Hello"
      assert message.conversation_id == conversation.id
      assert message.user_id == user.id
    end

    it "returns not found when user is not in conversation" do
      conversation = insert(:conversation)
      user = insert(:user)

      {:error, error} =
        MessageResolver.create(nil, %{conversation_id: conversation.id, body: "Hello"}, %{
          context: %{current_user: user}
        })

      assert error == "Not found"
    end

    it "returns not found when conversation does not exist" do
      user = insert(:user)

      {:error, error} =
        MessageResolver.create(nil, %{conversation_id: -1, body: "Hello"}, %{
          context: %{current_user: user}
        })

      assert error == "Not found"
    end

    it "returns error for missing params" do
      conversation = insert(:conversation)
      user = insert(:user)
      insert(:conversation_user, conversation: conversation, user: user)

      {:error, error} =
        MessageResolver.create(nil, %{conversation_id: conversation.id}, %{
          context: %{current_user: user}
        })

      assert error == [[field: :body, message: "Can't be blank"]]
    end

    it "returns error for unauthenticated user" do
      conversation = insert(:conversation)

      {:error, error} =
        MessageResolver.create(nil, %{conversation_id: conversation.id, body: "Hello"}, nil)

      assert error == "Unauthenticated"
    end
  end
end
