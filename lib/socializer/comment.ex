defmodule Socializer.Comment do
  use Ecto.Schema
  import Ecto.Changeset

  alias Socializer.{Post, User}

  schema "comments" do
    field :body, :string

    belongs_to :post, Post
    belongs_to :user, User

    timestamps()
  end

  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:body])
    |> validate_required([:body])
  end
end
