defmodule Socializer.Message do
  use Ecto.Schema
  import Ecto.Changeset

  alias Socializer.{Conversation, User}

  schema "messages" do
    field :body, :string

    belongs_to :conversation, Conversation
    belongs_to :user, User

    timestamps()
  end

  def changeset(message, attrs) do
    message
    |> cast(attrs, [:conversation_id, :user_id, :body])
    |> validate_required([:conversation_id, :user_id, :body])
  end
end
