defmodule Socializer.Repo.Migrations.CreateConversationUsers do
  use Ecto.Migration

  def change do
    create table(:conversation_users) do
      add :conversation_id, references(:conversations, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:conversation_users, [:conversation_id])
    create index(:conversation_users, [:user_id])
    create unique_index(:conversation_users, [:conversation_id, :user_id])
  end
end
