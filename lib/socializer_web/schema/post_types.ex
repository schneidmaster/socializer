defmodule SocializerWeb.Schema.PostTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Ecto, repo: Socializer.Repo

  alias SocializerWeb.Resolvers

  @desc "A post on the site"
  object :post do
    field :id, :id
    field :body, :string
    field :inserted_at, :naive_datetime

    field :user, :user, resolve: assoc(:user)
    field :comments, list_of(:comment), resolve: assoc(:comments)
  end

  object :post_queries do
    @desc "Get all posts"
    field :posts, list_of(:post) do
      resolve(&Resolvers.PostResolver.list/3)
    end

    @desc "Get a specific post"
    field :post, :post do
      arg(:id, non_null(:id))
      resolve(&Resolvers.PostResolver.show/3)
    end
  end

  object :post_mutations do
    @desc "Create post"
    field :create_post, :post do
      arg(:body, non_null(:string))

      resolve(&Resolvers.PostResolver.create/3)
    end
  end
end
