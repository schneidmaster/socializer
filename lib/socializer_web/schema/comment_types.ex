defmodule SocializerWeb.Schema.CommentTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Ecto, repo: Socializer.Repo

  alias SocializerWeb.Resolvers

  @desc "A comment on the site"
  object :comment do
    field :id, :id
    field :body, :string

    field :post, :post, resolve: assoc(:post)
    field :user, :user, resolve: assoc(:user)
  end

  object :comment_queries do
    @desc "Get all comments for a specific post"
    field :post_comments, list_of(:comment) do
      arg(:post_id, non_null(:id))
      resolve(&Resolvers.CommentResolver.list/3)
    end
  end

  object :comment_mutations do
    @desc "Create comment"
    field :create_comment, :comment do
      arg(:post_id, non_null(:id))
      arg(:body, non_null(:string))

      resolve(&Resolvers.CommentResolver.create/3)
    end
  end
end
