import React from "react";
import { render } from "react-testing-library";
import { MemoryRouter } from "react-router-dom";
import Chat from "./Chat";

jest.mock("components", () => ({
  ChatBar: () => <div className="chat-bar" />,
  Conversation: () => <div className="conversation" />,
}));

describe("Chat", () => {
  it("renders correctly when chat is selected", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/chat/123"]}>
        <Chat match={{ params: { id: 123 } }} />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when no chat is selected", () => {
    const { container } = render(
      <MemoryRouter>
        <Chat match={{ params: {} }} />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
