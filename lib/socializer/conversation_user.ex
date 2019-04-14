defmodule Socializer.ConversationUser do
  use Ecto.Schema
  import Ecto.Changeset

  alias Socializer.{Repo, Conversation, User}

  schema "conversation_users" do
    belongs_to :conversation, Conversation
    belongs_to :user, User

    timestamps()
  end

  def find_by(conds) do
    Repo.get_by(__MODULE__, conds)
  end

  def changeset(attrs) do
    %__MODULE__{}
    |> changeset(attrs)
  end

  def changeset(conversation_users, attrs) do
    conversation_users
    |> cast(attrs, [:conversation_id, :user_id])
    |> validate_required([:conversation_id, :user_id])
    |> foreign_key_constraint(:conversation_id)
    |> foreign_key_constraint(:user_id)
    |> unique_constraint(:user_id, name: :conversation_users_conversation_id_user_id_index)
  end
end
