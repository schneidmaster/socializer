defmodule SocializerWeb.Integration.MessageIntegrationTest do
  use SocializerWeb.ConnCase
  alias Socializer.AbsintheHelpers

  describe "#list" do
    it "returns messages" do
      user = insert(:user)
      conversation = insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)
      message = insert(:message, conversation: conversation)

      query = """
      {
        messages(conversationId: #{conversation.id}) {
          id
          body
        }
      }
      """

      res =
        build_conn()
        |> AbsintheHelpers.authenticate_conn(user)
        |> post("/graphiql", AbsintheHelpers.query_skeleton(query, "messages"))

      messages = json_response(res, 200)["data"]["messages"]
      assert List.first(messages)["id"] == to_string(message.id)
    end
  end

  describe "#create" do
    it "creates message" do
      user = insert(:user)
      conversation = insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)

      mutation = """
      {
        createMessage(conversationId: #{conversation.id}, body: "Hello friend") {
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

      message = json_response(res, 200)["data"]["createMessage"]
      assert message["body"] == "Hello friend"
      assert message["user"]["id"] == to_string(user.id)
    end
  end
end
