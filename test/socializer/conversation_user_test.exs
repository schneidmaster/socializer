defmodule Socializer.ConversationUserTest do
  use SocializerWeb.ConnCase

  alias Socializer.ConversationUser

  describe "#find_by" do
    it "finds conversation user by conditions" do
      conversation = insert(:conversation)
      user = insert(:user)
      conversation_user = insert(:conversation_user, conversation: conversation, user: user)
      found = ConversationUser.find_by(%{conversation_id: conversation.id, user_id: user.id})
      assert found.id == conversation_user.id
    end
  end

  describe "#changeset" do
    it "validates with correct attributes" do
      conversation = insert(:conversation)
      user = insert(:user)
      valid_attrs = %{conversation_id: conversation.id, user_id: user.id}
      changeset = ConversationUser.changeset(%ConversationUser{}, valid_attrs)
      assert changeset.valid?
    end

    it "does not validate with missing attrs" do
      changeset =
        ConversationUser.changeset(
          %ConversationUser{},
          %{}
        )

      refute changeset.valid?
    end
  end
end
