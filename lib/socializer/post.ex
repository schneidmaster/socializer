defmodule Socializer.Post do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  alias Socializer.{Repo, Comment, User}

  schema "posts" do
    field :body, :string

    belongs_to :user, User
    has_many :comments, Comment

    timestamps()
  end

  def all do
    Repo.all(from p in __MODULE__, order_by: [desc: p.id])
  end

  def find(id) do
    Repo.get(__MODULE__, id)
  end

  def create(attrs) do
    attrs
    |> changeset()
    |> Repo.insert()
  end

  def changeset(attrs) do
    %__MODULE__{}
    |> changeset(attrs)
  end

  def changeset(post, attrs) do
    post
    |> cast(attrs, [:body, :user_id])
    |> validate_required([:body, :user_id])
    |> foreign_key_constraint(:user_id)
  end
end
