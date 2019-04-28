defmodule Socializer.DemoManager do
  import Ecto.Query

  alias Socializer.{
    DemoManager,
    Repo,
    Comment,
    Conversation,
    ConversationUser,
    Message,
    Post,
    User
  }

  def reset_and_seed_database!(force \\ false) do
    if force || System.get_env("CLEAR_DB_WEEKLY") do
      DemoManager.reset_database!()
      DemoManager.seed!()
    end
  end

  def reset_database! do
    # Deletion order is to avoid violating foreign-key
    # constraints.
    # Note: does not delete users.
    Repo.delete_all(Comment)
    Repo.delete_all(Post)
    Repo.delete_all(Message)
    Repo.delete_all(ConversationUser)
    Repo.delete_all(Conversation)
  end

  def seed! do
    users =
      case Repo.aggregate(User, :count, :id) > 0 do
        true ->
          Repo.all(
            from u in User,
              where:
                u.email in [
                  "joesmith@lvh.me",
                  "janedoe@lvh.me",
                  "jeremypeters@lvh.me",
                  "jackhawk@lvh.me"
                ]
          )

        false ->
          [
            Repo.insert!(%User{
              name: "Joe Smith",
              email: "joesmith@lvh.me",
              password: random_password()
            }),
            Repo.insert!(%User{
              name: "Jane Doe",
              email: "janedoe@lvh.me",
              password: random_password()
            }),
            Repo.insert!(%User{
              name: "Jeremy Peters",
              email: "jeremypeters@lvh.me",
              password: random_password()
            }),
            Repo.insert!(%User{
              name: "Jack Hawk",
              email: "jackhawk@lvh.me",
              password: :crypto.strong_rand_bytes(32) |> Base.encode64() |> binary_part(0, 32)
            })
          ]
      end

    posts =
      [
        "You have your way. I have my way. As for the right way, the correct way, and the only way, it does not exist.",
        "A concept is a brick. It can be used to build a courthouse of reason. Or it can be thrown through the window.",
        "The struggle itself toward the heights is enough to fill a man’s heart. One must imagine Sisyphus happy."
      ]
      |> Enum.map(fn body ->
        Repo.insert!(%Post{
          body: body,
          user_id: Enum.random(users).id
        })
      end)

    [
      "We live in a world where there is more and more information, and less and less meaning.",
      "Consider the cattle, grazing as they pass you by. They do not know what is meant by yesterday or today, they leap about, eat, rest, digest, leap about again, and so from morn till night and from day to day, fettered to the moment and its pleasure or displeasure, and thus neither melancholy nor bored.",
      "Each day is a little life: every waking and rising a little birth, every fresh morning a little youth, every going to rest and sleep a little death.",
      "It has always seemed to me that my existence consisted purely and exclusively of nothing but the most outrageous nonsense.",
      "Hello babies. Welcome to Earth. It's hot in the summer and cold in the winter. It's round and wet and crowded. On the outside, babies, you've got a hundred years here. There's only one rule that I know of, babies - God damn it, you've got to be kind.",
      "The place to improve the world is first in one's own heart and head and hands, and then work outward from there."
    ]
    |> Enum.map(fn body ->
      Repo.insert!(%Comment{
        body: body,
        post_id: Enum.random(posts).id,
        user_id: Enum.random(users).id
      })
    end)
  end

  defp random_password do
    :crypto.strong_rand_bytes(32)
    |> Base.encode64()
    |> binary_part(0, 32)
  end
end
