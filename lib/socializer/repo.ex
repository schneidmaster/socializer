defmodule Socializer.Repo do
  use Ecto.Repo,
    otp_app: :socializer,
    adapter: Ecto.Adapters.Postgres

  def reset_database do
    if System.get_env("CLEAR_DB_NIGHTLY") do
      # Deletion order is to avoid violating foreign-key
      # constraints.
      Socializer.Repo.delete_all(Socializer.Comment)
      Socializer.Repo.delete_all(Socializer.Post)
      Socializer.Repo.delete_all(Socializer.Message)
      Socializer.Repo.delete_all(Socializer.ConversationUser)
      Socializer.Repo.delete_all(Socializer.Conversation)
      Socializer.Repo.delete_all(Socializer.User)
    end
  end
end
