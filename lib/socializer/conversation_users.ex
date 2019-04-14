defmodule Socializer.ConversationUsers do
  use Ecto.Schema
  import Ecto.Changeset

  alias Socializer.{Conversation, User}

  schema "conversation_users" do
    belongs_to :conversation, Conversation
    belongs_to :user, User

    timestamps()
  end

  def changeset(conversation_users, attrs) do
    conversation_users
    |> cast(attrs, [:conversation_id, :user_id])
    |> validate_required([:conversation_id, :user_id])
  end
end
