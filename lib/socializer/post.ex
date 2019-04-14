defmodule Socializer.Post do
  use Ecto.Schema
  import Ecto.Changeset

  alias Socializer.User

  schema "posts" do
    field :body, :string

    belongs_to :user, User

    timestamps()
  end

  def changeset(post, attrs) do
    post
    |> cast(attrs, [:body, :user_id])
    |> validate_required([:body, :user_id])
  end
end
