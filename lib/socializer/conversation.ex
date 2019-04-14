defmodule Socializer.Conversation do
  use Ecto.Schema
  import Ecto.Changeset

  alias Socializer.{Message, User}

  schema "conversations" do
    field :title, :string

    has_many :messages, Message
    many_to_many :users, User, join_through: "conversation_users"

    timestamps()
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
