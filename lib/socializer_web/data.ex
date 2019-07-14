defmodule SocializerWeb.Data do
  import Ecto.Query

  def data() do
    Dataloader.Ecto.new(Socializer.Repo, query: &query/2)
  end

  def query(queryable, params) do
    case Map.get(params, :order_by) do
      nil -> queryable
      order_by -> from record in queryable, order_by: ^order_by
    end
  end
end
