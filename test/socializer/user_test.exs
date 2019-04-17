defmodule Socializer.UserTest do
  use SocializerWeb.ConnCase

  alias Socializer.User

  @valid_attrs %{name: "Joe Smith", email: "bar@baz.com", password: "s3cr3t"}

  describe "#search" do
    it "returns accurate results" do
      current_user = insert(:user, name: "Jane Smith")
      user_a = insert(:user, name: "Jane Doe")
      insert(:user, name: "John Mark")

      results = User.search("Jane", current_user)
      assert length(results) == 1
      assert List.first(results).id == user_a.id
    end
  end

  describe "#find" do
    it "finds user" do
      user = insert(:user, name: "Jane Smith")
      found = User.find(user.id)
      assert found.id == user.id
    end
  end

  describe "#find_by" do
    it "finds user by conditions" do
      user = insert(:user, email: "jane@smith.com")
      found = User.find_by(%{email: "jane@smith.com"})
      assert found.id == user.id
    end
  end

  describe "#create" do
    it "creates user" do
      {:ok, user} = User.create(@valid_attrs)
      assert user.name == "Joe Smith"
    end
  end

  describe "#changeset" do
    it "validates with correct attributes" do
      changeset = User.changeset(%User{}, @valid_attrs)
      assert changeset.valid?
    end

    it "does not validate with invalid email format" do
      changeset =
        User.changeset(
          %User{},
          Map.put(@valid_attrs, :email, "foo.com")
        )

      refute changeset.valid?
    end
  end
end
