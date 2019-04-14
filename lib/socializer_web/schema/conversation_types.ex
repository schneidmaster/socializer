defmodule SocializerWeb.Schema.ConversationTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Ecto, repo: Socializer.Repo

  alias SocializerWeb.Resolvers

  @desc "A conversation on the site"
  object :conversation do
    field :id, :id
    field :title, :string

    field :messages, list_of(:message), resolve: assoc(:messages)
    field :users, list_of(:user), resolve: assoc(:users)
  end

  object :conversation_queries do
    @desc "Get all conversations for current user"
    field :conversations, list_of(:conversation) do
      resolve(&Resolvers.ConversationResolver.list/3)
    end
  end

  object :conversation_mutations do
    @desc "Create conversation"
    field :create_conversation, :conversation do
      arg(:user_ids, non_null(list_of(:id)))

      resolve(&Resolvers.ConversationResolver.create/3)
    end
  end
end
