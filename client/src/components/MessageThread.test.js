import React from "react";
import { render } from "@testing-library/react";
import { AuthContext } from "util/context";
import MessageThread from "./MessageThread";

describe("MessageThread", () => {
  const messages = [
    {
      id: 123,
      body: "Some thoughts",
      user: {
        id: "456",
        name: "John Smith",
        gravatarMd5: "abcdefg",
      },
    },
    {
      id: 456,
      body: "Other thoughts",
      user: {
        id: "789",
        name: "Jane Smith",
        gravatarMd5: "defghi",
      },
    },
  ];

  it("renders correctly", () => {
    const { container } = render(
      <AuthContext.Provider value={{ userId: "456" }}>
        <MessageThread messages={messages} />
      </AuthContext.Provider>,
    );
    expect(container).toMatchSnapshot();
  });
});
