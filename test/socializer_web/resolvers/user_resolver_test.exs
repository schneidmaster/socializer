defmodule SocializerWeb.UserResolverTest do
  use SocializerWeb.ConnCase

  alias SocializerWeb.Resolvers.UserResolver

  describe "#search_users" do
    it "returns users for a search, excluding current user" do
      current_user = insert(:user, name: "Jake")
      user_a = insert(:user, name: "Jake")
      insert(:user, name: "Joe")

      {:ok, results} =
        UserResolver.search_users(nil, %{search_term: "Jake"}, %{
          context: %{current_user: current_user}
        })

      assert length(results) == 1
      assert List.first(results).id == user_a.id
    end

    it "returns error for unauthenticated user" do
      {:error, error} = UserResolver.search_users(nil, %{search_term: "Joe"}, nil)

      assert error == "Unauthenticated"
    end
  end

  describe "#current_user" do
    it "returns the current user" do
      current_user = insert(:user)

      {:ok, found} =
        UserResolver.current_user(nil, nil, %{
          context: %{current_user: current_user}
        })

      assert found.id == current_user.id
    end

    it "returns error for unauthenticated user" do
      {:error, error} = UserResolver.current_user(nil, nil, nil)

      assert error == "Unauthenticated"
    end
  end

  describe "#signup" do
    it "creates user on valid signup" do
      {:ok, user} =
        UserResolver.signup(
          nil,
          %{name: "Jeremy Smith", email: "jeremy@smith.com", password: "password"},
          nil
        )

      assert user.name == "Jeremy Smith"
      assert user.email == "jeremy@smith.com"
    end

    it "returns error for missing params" do
      {:error, error} =
        UserResolver.signup(
          nil,
          %{email: "jeremy@smith.com", password: "password"},
          nil
        )

      assert error == [[field: :name, message: "Can't be blank"]]
    end
  end

  describe "#authenticate" do
    it "returns user on valid credentials" do
      user = insert(:user, email: "john@doe.com", password: "password")

      {:ok, found} =
        UserResolver.authenticate(
          nil,
          %{email: "john@doe.com", password: "password"},
          nil
        )

      assert found.id == user.id
    end

    it "returns error for nonexistend user" do
      {:error, error} =
        UserResolver.authenticate(
          nil,
          %{email: "john@doe.com", password: "password"},
          nil
        )

      assert error == [[field: :email, message: "Invalid email or password"]]
    end

    it "returns error for invalid credentials" do
      insert(:user, email: "john@doe.com", password: "password")

      {:error, error} =
        UserResolver.authenticate(
          nil,
          %{email: "john@doe.com", password: "notthepassword"},
          nil
        )

      assert error == [[field: :email, message: "Invalid email or password"]]
    end
  end
end
