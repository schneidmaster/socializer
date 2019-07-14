defmodule SocializerWeb.Schema.UserTypes do
  use Absinthe.Schema.Notation

  import Absinthe.Resolution.Helpers, only: [dataloader: 1]

  alias SocializerWeb.{Data, Resolvers}

  @desc "A user of the site"
  object :user do
    field :id, :id
    field :name, :string
    field :email, :string
    field :token, :string

    field :gravatar_md5, :string do
      resolve(fn user, _, _ ->
        {:ok, :crypto.hash(:md5, user.email) |> Base.encode16(case: :lower)}
      end)
    end

    field :posts, list_of(:post), resolve: dataloader(Data)
  end

  object :user_queries do
    @desc "Search users"
    field :search_users, list_of(:user) do
      arg(:search_term, non_null(:string))

      resolve(&Resolvers.UserResolver.search_users/3)
    end

    @desc "Get current user"
    field :current_user, :user do
      resolve(&Resolvers.UserResolver.current_user/3)
    end
  end

  object :user_mutations do
    @desc "Authenticate"
    field :authenticate, :user do
      arg(:email, non_null(:string))
      arg(:password, non_null(:string))

      resolve(&Resolvers.UserResolver.authenticate/3)
    end

    @desc "Sign up"
    field :sign_up, :user do
      arg(:name, non_null(:string))
      arg(:email, non_null(:string))
      arg(:password, non_null(:string))

      resolve(&Resolvers.UserResolver.signup/3)
    end
  end
end
