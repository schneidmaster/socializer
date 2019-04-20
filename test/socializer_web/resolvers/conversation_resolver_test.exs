defmodule SocializerWeb.ConversationResolverTest do
  use SocializerWeb.ConnCase

  alias SocializerWeb.Resolvers.ConversationResolver

  describe "#list" do
    it "returns conversations for the current user" do
      user = insert(:user)
      conversation = insert(:conversation)
      insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)
      {:ok, results} = ConversationResolver.list(nil, nil, %{context: %{current_user: user}})
      assert length(results) == 1
      assert List.first(results).id == conversation.id
    end

    it "returns unauthenticated with no current user" do
      {:error, error} = ConversationResolver.list(nil, nil, nil)
      assert error == "Unauthenticated"
    end
  end

  describe "#show" do
    it "finds conversation for the current user" do
      user = insert(:user)
      conversation = insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)

      {:ok, found} =
        ConversationResolver.show(nil, %{id: conversation.id}, %{context: %{current_user: user}})

      assert found.id == conversation.id
    end

    it "returns not found when conversation does not exist" do
      user = insert(:user)

      {:error, error} =
        ConversationResolver.show(nil, %{id: -1}, %{context: %{current_user: user}})

      assert error == "Not found"
    end

    it "returns not found when user is not in conversation" do
      user = insert(:user)
      conversation = insert(:conversation)

      {:error, error} =
        ConversationResolver.show(nil, %{id: conversation.id}, %{context: %{current_user: user}})

      assert error == "Not found"
    end

    it "returns unauthenticated with no current user" do
      conversation = insert(:conversation)
      {:error, error} = ConversationResolver.show(nil, %{id: conversation.id}, nil)
      assert error == "Unauthenticated"
    end
  end

  describe "#create" do
    it "returns existing conversation if one is found" do
      user = insert(:user)
      user_a = insert(:user)
      user_b = insert(:user)
      conversation = insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)
      insert(:conversation_user, conversation: conversation, user: user_a)
      insert(:conversation_user, conversation: conversation, user: user_b)

      {:ok, created} =
        ConversationResolver.create(nil, %{user_ids: [user_a.id, user_b.id]}, %{
          context: %{current_user: user}
        })

      assert created.id == conversation.id
    end

    it "creates new conversation if one does not exist for all users" do
      user = insert(:user, name: "Joe")
      user_a = insert(:user, name: "John")
      user_b = insert(:user, name: "Jim")
      conversation = insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)
      insert(:conversation_user, conversation: conversation, user: user_a)

      {:ok, created} =
        ConversationResolver.create(nil, %{user_ids: [user_a.id, user_b.id]}, %{
          context: %{current_user: user}
        })

      refute created.id == conversation.id
      assert created.title == "Joe, John, Jim"
    end

    it "returns error for missing params" do
      user = insert(:user)

      {:error, error} =
        ConversationResolver.create(nil, %{user_ids: [nil]}, %{
          context: %{current_user: user}
        })

      assert error == [[field: :user_id, message: "Can't be blank"]]
    end

    it "returns error for unauthenticated user" do
      user = insert(:user)

      {:error, error} = ConversationResolver.create(nil, %{user_ids: [user.id]}, nil)

      assert error == "Unauthenticated"
    end
  end
end
