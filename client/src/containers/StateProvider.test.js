import React, { useContext } from "react";
import { render, fireEvent } from "@testing-library/react";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { MockLink } from "@apollo/react-testing";
import StateProvider from "./StateProvider";
import { AuthContext, ChatContext } from "util/context";

jest.mock("util/apollo");
import { refreshSocket } from "util/apollo";

jest.mock("js-cookie");
import Cookies from "js-cookie";

const StateDummy = () => {
  const { token, userId, setAuth } = useContext(AuthContext);
  const { chatState, setChatState } = useContext(ChatContext);

  return (
    <div>
      <div data-testid="auth-state-token" data-value={token} />
      <div data-testid="auth-state-user-id" data-value={userId} />
      <div data-testid="chat-state" data-value={chatState} />
      <button
        data-testid="auth-login"
        onClick={(e) => setAuth({ token: "abc", id: "123" })}
      />
      <button data-testid="auth-logout" onClick={(e) => setAuth(null)} />
      <input
        data-testid="chat-input"
        onChange={(e) => setChatState(e.target.value)}
      />
    </div>
  );
};

const createClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink([]),
  });

describe("StateProvider", () => {
  it("uses initial values for state", () => {
    const { getByTestId } = render(
      <ApolloProvider client={createClient()}>
        <StateProvider initialToken="abc" initialUserId="123" socket="socket">
          <StateDummy />
        </StateProvider>
      </ApolloProvider>,
    );
    expect(getByTestId("auth-state-token").dataset.value).toEqual("abc");
    expect(getByTestId("auth-state-user-id").dataset.value).toEqual("123");
    expect(getByTestId("chat-state").dataset.value).toEqual("default");
  });

  it("sets chat state", () => {
    const { getByTestId } = render(
      <ApolloProvider client={createClient()}>
        <StateProvider initialToken="abc" initialUserId="123" socket="socket">
          <StateDummy />
        </StateProvider>
      </ApolloProvider>,
    );
    fireEvent.change(getByTestId("chat-input"), {
      target: { value: "creating" },
    });
    expect(getByTestId("chat-state").dataset.value).toEqual("creating");
  });

  it("logs in, sets cookies, and resets socket", () => {
    const { getByTestId } = render(
      <ApolloProvider client={createClient()}>
        <StateProvider socket="socket">
          <StateDummy />
        </StateProvider>
      </ApolloProvider>,
    );
    fireEvent.click(getByTestId("auth-login"));
    expect(getByTestId("auth-state-token").dataset.value).toEqual("abc");
    expect(getByTestId("auth-state-user-id").dataset.value).toEqual("123");
    expect(refreshSocket).toBeCalledWith("socket");
    expect(Cookies.set).toBeCalledWith("token", "abc");
    expect(Cookies.set).toBeCalledWith("userId", "123");
  });

  it("logs out, clears cookies and store, and resets socket", () => {
    const client = createClient();
    jest.spyOn(client, "clearStore");
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <StateProvider initialToken="abc" initialUserId="123" socket="socket">
          <StateDummy />
        </StateProvider>
      </ApolloProvider>,
    );
    fireEvent.click(getByTestId("auth-logout"));
    expect(getByTestId("auth-state-token").dataset.value).toEqual(undefined);
    expect(getByTestId("auth-state-user-id").dataset.value).toEqual(undefined);
    expect(client.clearStore).toBeCalled();
    expect(refreshSocket).toBeCalledWith("socket");
    expect(Cookies.remove).toBeCalledWith("token");
    expect(Cookies.remove).toBeCalledWith("userId");
  });
});
