import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "util/context";
import Chat from "./Chat";

jest.mock("react-router-dom", () => {
  const { MemoryRouter, Route, Switch } = jest.requireActual(
    "react-router-dom",
  );

  return {
    Redirect: () => <div className="redirect" />,
    MemoryRouter,
    Route,
    Switch,
  };
});

jest.mock("components", () => ({
  ChatBar: () => <div className="chat-bar" />,
  Conversation: () => <div className="conversation" />,
}));

describe("Chat", () => {
  it("redirects when unauthenticated", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/chat/123"]}>
        <AuthContext.Provider value={{}}>
          <Chat match={{ params: { id: 123 } }} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when chat is selected", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/chat/123"]}>
        <AuthContext.Provider value={{ token: "abc" }}>
          <Chat match={{ params: { id: 123 } }} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when no chat is selected", () => {
    const { container } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ token: "abc" }}>
          <Chat match={{ params: {} }} />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
