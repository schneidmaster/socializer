defmodule Socializer.Post do
  use Socializer.Model

  alias Socializer.{Repo, Comment, User}

  schema "posts" do
    field :body, :string

    belongs_to :user, User
    has_many :comments, Comment

    timestamps()
  end

  def all do
    Repo.all(from row in __MODULE__, order_by: [desc: row.id])
  end

  def changeset(post, attrs) do
    post
    |> cast(attrs, [:body, :user_id])
    |> validate_required([:body, :user_id])
    |> foreign_key_constraint(:user_id)
  end
end
