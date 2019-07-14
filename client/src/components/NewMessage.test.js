import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import NewMessage, { CREATE_MESSAGE } from "./NewMessage";

describe("NewMessage", () => {
  it("renders correctly", () => {
    const { container } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <NewMessage conversationId={123} />
      </MockedProvider>,
    );
    expect(container).toMatchSnapshot();
  });

  it("creates new message", async () => {
    const mocks = [
      {
        request: {
          query: CREATE_MESSAGE,
          variables: { conversationId: 123, body: "Hi there" },
        },
        result: { data: { createMessage: { id: 123 } } },
      },
    ];
    const { getByPlaceholderText, getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <NewMessage conversationId={123} />
      </MockedProvider>,
    );
    fireEvent.change(getByPlaceholderText("What's on your mind?"), {
      target: { value: "Hi there" },
    });
    fireEvent.submit(getByTestId("new-message"));
    await wait(() =>
      expect(getByPlaceholderText("What's on your mind?").value).toEqual(""),
    );
  });
});
