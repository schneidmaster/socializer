defmodule SocializerWeb.Integration.UserIntegrationTest do
  use SocializerWeb.ConnCase
  alias Socializer.AbsintheHelpers

  describe "#search_users" do
    it "returns matching users" do
      user = insert(:user)
      user_a = insert(:user, name: "Jack Smith")
      insert(:user, name: "Deborah Thomas")

      query = """
      {
        searchUsers(searchTerm: "Jack") {
          id
          name
        }
      }
      """

      res =
        build_conn()
        |> AbsintheHelpers.authenticate_conn(user)
        |> post("/graphiql", AbsintheHelpers.query_skeleton(query, "searchUsers"))

      users = json_response(res, 200)["data"]["searchUsers"]
      assert length(users) == 1
      assert List.first(users)["id"] == to_string(user_a.id)
    end
  end

  describe "#current_user" do
    it "returns current user" do
      user = insert(:user)

      query = """
      {
        currentUser {
          id
          name
          gravatarMd5
        }
      }
      """

      res =
        build_conn()
        |> AbsintheHelpers.authenticate_conn(user)
        |> post("/graphiql", AbsintheHelpers.query_skeleton(query, "currentUser"))

      currentUser = json_response(res, 200)["data"]["currentUser"]
      assert currentUser["id"] == to_string(user.id)
    end
  end

  describe "#authenticate" do
    it "authenticates user" do
      user = insert(:user, password: "password")

      mutation = """
      {
        authenticate(email: "#{user.email}", password: "password") {
          id
        }
      }
      """

      res =
        build_conn()
        |> post("/graphiql", AbsintheHelpers.mutation_skeleton(mutation))

      authenticate = json_response(res, 200)["data"]["authenticate"]
      assert authenticate["id"] == to_string(user.id)
    end
  end

  describe "#sign_up" do
    it "signs up user" do
      mutation = """
      {
        signUp(name: "Jeremy Stevens", email: "jeremy@lvh.me", password: "password") {
          name
          email
        }
      }
      """

      res =
        build_conn()
        |> post("/graphiql", AbsintheHelpers.mutation_skeleton(mutation))

      user = json_response(res, 200)["data"]["signUp"]
      assert user["name"] == "Jeremy Stevens"
      assert user["email"] == "jeremy@lvh.me"
    end
  end
end
