defmodule Socializer.Comment do
  use Socializer.Model

  alias Socializer.{Post, User}

  schema "comments" do
    field :body, :string

    belongs_to :post, Post
    belongs_to :user, User

    timestamps()
  end

  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:body, :post_id, :user_id])
    |> validate_required([:body, :post_id, :user_id])
    |> foreign_key_constraint(:post_id)
    |> foreign_key_constraint(:user_id)
  end
end
