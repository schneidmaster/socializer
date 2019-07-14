defmodule SocializerWeb.Integration.PostIntegrationTest do
  use SocializerWeb.ConnCase
  alias Socializer.AbsintheHelpers

  describe "#list" do
    it "returns posts" do
      post_a = insert(:post)
      post_b = insert(:post)

      query = """
      {
        posts {
          id
          body
        }
      }
      """

      res =
        build_conn()
        |> post("/graphiql", AbsintheHelpers.query_skeleton(query, "posts"))

      posts = json_response(res, 200)["data"]["posts"]
      assert List.first(posts)["id"] == to_string(post_b.id)
      assert List.last(posts)["id"] == to_string(post_a.id)
    end
  end

  describe "#show" do
    it "returns specific post" do
      post = insert(:post)
      comment = insert(:comment, post: post)

      query = """
      {
        post(id: #{post.id}) {
          id
          body
          comments {
            id
            body
          }
        }
      }
      """

      res =
        build_conn()
        |> post("/graphiql", AbsintheHelpers.query_skeleton(query, "post"))

      found = json_response(res, 200)["data"]["post"]
      assert found["id"] == to_string(post.id)
      comments = found["comments"]
      assert List.first(comments)["id"] == to_string(comment.id)
    end
  end

  describe "#create" do
    it "creates post" do
      user = insert(:user)

      mutation = """
      {
        createPost(body: "A few thoughts") {
          body
          user {
            id
          }
        }
      }
      """

      res =
        build_conn()
        |> AbsintheHelpers.authenticate_conn(user)
        |> post("/graphiql", AbsintheHelpers.mutation_skeleton(mutation))

      post = json_response(res, 200)["data"]["createPost"]
      assert post["body"] == "A few thoughts"
      assert post["user"]["id"] == to_string(user.id)
    end
  end
end
