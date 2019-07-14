defmodule SocializerWeb.Integration.ConversationIntegrationTest do
  use SocializerWeb.ConnCase
  alias Socializer.AbsintheHelpers

  describe "#list" do
    it "returns conversations" do
      user = insert(:user)
      conversation = insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)

      query = """
      {
        conversations {
          id
          title
        }
      }
      """

      res =
        build_conn()
        |> AbsintheHelpers.authenticate_conn(user)
        |> post("/graphiql", AbsintheHelpers.query_skeleton(query, "conversations"))

      conversations = json_response(res, 200)["data"]["conversations"]
      assert List.first(conversations)["id"] == to_string(conversation.id)
    end
  end

  describe "#show" do
    it "returns specific conversation" do
      user = insert(:user)
      conversation = insert(:conversation)
      insert(:conversation_user, conversation: conversation, user: user)
      message = insert(:message, conversation: conversation)

      query = """
      {
        conversation(id: #{conversation.id}) {
          id
          title
          messages {
            id
            body
          }
        }
      }
      """

      res =
        build_conn()
        |> AbsintheHelpers.authenticate_conn(user)
        |> post("/graphiql", AbsintheHelpers.query_skeleton(query, "conversation"))

      found = json_response(res, 200)["data"]["conversation"]
      assert found["id"] == to_string(conversation.id)
      messages = found["messages"]
      assert List.first(messages)["id"] == to_string(message.id)
    end
  end

  describe "#create" do
    it "creates conversation" do
      user = insert(:user, name: "Jack Black")
      other_user = insert(:user, name: "John Smith")

      mutation = """
      {
        createConversation(userIds: [#{other_user.id}]) {
          id
          title
        }
      }
      """

      res =
        build_conn()
        |> AbsintheHelpers.authenticate_conn(user)
        |> post("/graphiql", AbsintheHelpers.mutation_skeleton(mutation))

      conversation = json_response(res, 200)["data"]["createConversation"]
      assert conversation["title"] == "Jack Black, John Smith"
    end
  end
end
