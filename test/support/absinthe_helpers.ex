defmodule Socializer.AbsintheHelpers do
  alias Socializer.Guardian

  def authenticate_conn(conn, user) do
    {:ok, token, _claims} = Guardian.encode_and_sign(user)
    Plug.Conn.put_req_header(conn, "authorization", "Bearer #{token}")
  end

  def query_skeleton(query, query_name) do
    %{
      "operationName" => "#{query_name}",
      "query" => "query #{query_name} #{query}",
      "variables" => "{}"
    }
  end

  def mutation_skeleton(query) do
    %{
      "operationName" => "",
      "query" => "mutation #{query}",
      "variables" => ""
    }
  end
end
