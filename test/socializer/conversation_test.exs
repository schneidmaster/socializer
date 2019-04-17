defmodule Socializer.ConversationTest do
  use SocializerWeb.ConnCase

  alias Socializer.Conversation

  @valid_attrs %{title: "Zach, Joe"}

  describe "#all_for_user" do
    it "finds conversations for user" do
      user = insert(:user)
      conversation = insert(:conversation)
      insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)
      results = Conversation.all_for_user(user)
      assert length(results) == 1
      assert List.first(results).id == conversation.id
    end
  end

  describe "#find_for_user" do
    it "finds conversation for user" do
      user = insert(:user)
      conversation = insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)
      result = Conversation.find_for_user(conversation.id, user)
      assert result.id == conversation.id
    end

    it "does not find conversation not belonging to user" do
      user = insert(:user)
      conversation = insert(:conversation)
      result = Conversation.find_for_user(conversation.id, user)
      assert result == nil
    end
  end

  describe "#find_for_users" do
    it "finds conversation with all users" do
      conversation = insert(:conversation)
      user_a = insert(:user)
      user_b = insert(:user)
      insert(:conversation_user, conversation: conversation, user: user_a)
      insert(:conversation_user, conversation: conversation, user: user_b)
      result = Conversation.find_for_users([user_a.id, user_b.id])
      assert result.id == conversation.id
    end

    it "does not find conversation if a user is missing" do
      conversation = insert(:conversation)
      user_a = insert(:user)
      user_b = insert(:user)
      user_c = insert(:user)
      insert(:conversation_user, conversation: conversation, user: user_a)
      insert(:conversation_user, conversation: conversation, user: user_b)
      result = Conversation.find_for_users([user_a.id, user_b.id, user_c.id])
      assert result == nil
    end
  end

  describe "#user_ids" do
    it "finds users from conversation ID" do
      user = insert(:user)
      conversation = insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)
      result = Conversation.user_ids(conversation.id)
      assert length(result) == 1
      assert List.first(result) == user.id
    end

    it "finds users from conversation struct" do
      user = insert(:user)
      conversation = insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)
      result = Conversation.user_ids(conversation)
      assert length(result) == 1
      assert List.first(result) == user.id
    end
  end

  describe "#find" do
    it "finds conversation" do
      conversation = insert(:conversation)
      found = Conversation.find(conversation.id)
      assert found.id == conversation.id
    end
  end

  describe "#changeset" do
    it "validates with correct attributes" do
      changeset = Conversation.changeset(%Conversation{}, @valid_attrs)
      assert changeset.valid?
    end

    it "does not validate with missing attrs" do
      changeset =
        Conversation.changeset(
          %Conversation{},
          %{}
        )

      refute changeset.valid?
    end
  end
end
