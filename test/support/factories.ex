defmodule Socializer.Factory do
  use ExMachina.Ecto, repo: Socializer.Repo

  def user_factory do
    %Socializer.User{
      name: Faker.Name.name(),
      email: Faker.Internet.email(),
      password: "password",
      password_hash: Bcrypt.hash_pwd_salt("password")
    }
  end

  def post_factory do
    %Socializer.Post{
      body: Faker.Lorem.paragraph(),
      user: build(:user)
    }
  end

  def comment_factory do
    %Socializer.Comment{
      body: Faker.Lorem.paragraph(),
      post: build(:post),
      user: build(:user)
    }
  end

  def conversation_factory do
    %Socializer.Conversation{
      title: Faker.Lorem.sentence()
    }
  end

  def conversation_user_factory do
    %Socializer.ConversationUser{
      conversation: build(:conversation),
      user: build(:user)
    }
  end

  def message_factory do
    %Socializer.Message{
      body: Faker.Lorem.paragraph(),
      conversation: build(:conversation),
      user: build(:user)
    }
  end
end
