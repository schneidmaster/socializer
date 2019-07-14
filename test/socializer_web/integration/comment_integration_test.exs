defmodule SocializerWeb.Integration.CommentIntegrationTest do
  use SocializerWeb.ConnCase
  alias Socializer.AbsintheHelpers

  describe "#list" do
    it "returns comments" do
      post = insert(:post)
      comment_a = insert(:comment, post: post)
      comment_b = insert(:comment, post: post)

      query = """
      {
        postComments(postId: #{post.id}) {
          id
          body
        }
      }
      """

      res =
        build_conn()
        |> post("/graphiql", AbsintheHelpers.query_skeleton(query, "comments"))

      comments = json_response(res, 200)["data"]["postComments"]
      assert List.first(comments)["id"] == to_string(comment_a.id)
      assert List.last(comments)["id"] == to_string(comment_b.id)
    end
  end

  describe "#create" do
    it "creates comment" do
      user = insert(:user)
      post = insert(:post)

      mutation = """
      {
        createComment(postId: #{post.id}, body: "Opinions") {
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

      post = json_response(res, 200)["data"]["createComment"]
      assert post["body"] == "Opinions"
      assert post["user"]["id"] == to_string(user.id)
    end
  end
end
