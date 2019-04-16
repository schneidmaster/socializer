defmodule Socializer.User do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  alias Socializer.{Repo, Conversation, Post}

  schema "users" do
    field :email, :string
    field :name, :string
    field :password, :string, virtual: true
    field :password_hash, :string
    field :token, :string, virtual: true

    many_to_many :conversations, Conversation, join_through: "conversation_users"
    has_many :posts, Post

    timestamps()
  end

  def search(search_term, current_user) do
    Repo.all(
      from u in __MODULE__,
        where: ilike(u.name, ^("%" <> search_term <> "%")) and u.id != ^current_user.id,
        limit: 25
    )
  end

  def find(id) do
    Repo.get(__MODULE__, id)
  end

  def find_by(conds) do
    Repo.get_by(__MODULE__, conds)
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

  def changeset(%__MODULE__{} = user, attrs) do
    user
    |> cast(attrs, [:name, :email, :password])
    |> validate_required([:name, :email, :password])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
    |> put_password_hash
  end

  defp put_password_hash(
         %Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset
       ) do
    change(changeset, Bcrypt.add_hash(password))
  end

  defp put_password_hash(changeset), do: changeset
end
