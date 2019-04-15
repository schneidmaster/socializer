defmodule Socializer.Conversation do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  alias Socializer.{Repo, ConversationUser, Message, User}

  schema "conversations" do
    field :title, :string

    has_many :messages, Message
    many_to_many :users, User, join_through: "conversation_users"

    timestamps()
  end

  def all_for_user(user) do
    Repo.all(
      from c in __MODULE__,
        join: cu in ConversationUser,
        where: cu.conversation_id == c.id and cu.user_id == ^user.id,
        order_by: [desc: c.updated_at]
    )
  end

  def find(id) do
    Repo.get(__MODULE__, id)
  end

  def changeset(attrs) do
    %__MODULE__{}
    |> changeset(attrs)
  end

  def changeset(conversation, attrs) do
    conversation
    |> cast(attrs, [:title])
    |> validate_required([:title])
  end
end
