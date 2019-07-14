import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { MemoryRouter } from "react-router-dom";
import { ChatContext } from "util/context";
import NewConversation, {
  SEARCH_USERS,
  CREATE_CONVERSATION,
} from "./NewConversation";

jest.mock("react-router-dom", () => ({
  MemoryRouter: jest.requireActual("react-router-dom").MemoryRouter,
  Redirect: ({ to }) => <div data-testid="redirect" data-to={to} />,
}));

describe("NewConversation", () => {
  it("renders correctly", () => {
    const mocks = [
      {
        request: {
          query: SEARCH_USERS,
          variables: { searchTerm: "" },
        },
        result: { data: { searchUsers: [] } },
      },
    ];
    const { container } = render(
      <ChatContext.Provider value={{ setChatState: jest.fn() }}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <NewConversation />
        </MockedProvider>
      </ChatContext.Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("switches back to list when button is clicked", () => {
    const mocks = [
      {
        request: {
          query: SEARCH_USERS,
          variables: { searchTerm: "" },
        },
        result: { data: { searchUsers: [] } },
      },
    ];
    const setChatState = jest.fn();
    const { getByText } = render(
      <ChatContext.Provider value={{ setChatState }}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <NewConversation />
        </MockedProvider>
      </ChatContext.Provider>,
    );
    fireEvent.click(getByText("Cancel"));
    expect(setChatState).toBeCalledWith("default");
  });

  it("creates new conversation", async () => {
    const mocks = [
      {
        request: {
          query: SEARCH_USERS,
          variables: { searchTerm: "" },
        },
        result: { data: { searchUsers: [] } },
      },
      {
        request: {
          query: SEARCH_USERS,
          variables: { searchTerm: "Jeremy" },
        },
        result: {
          data: {
            searchUsers: [{ id: 1, name: "Jeremy Lane", gravatarMd5: "abc" }],
          },
        },
      },
      {
        request: {
          query: SEARCH_USERS,
          variables: { searchTerm: "" },
        },
        result: { data: { searchUsers: [] } },
      },
      {
        request: {
          query: SEARCH_USERS,
          variables: { searchTerm: "John" },
        },
        result: {
          data: {
            searchUsers: [{ id: 2, name: "John Thomas", gravatarMd5: "def" }],
          },
        },
      },
      {
        request: {
          query: SEARCH_USERS,
          variables: { searchTerm: "" },
        },
        result: { data: { searchUsers: [] } },
      },
      {
        request: {
          query: CREATE_CONVERSATION,
          variables: { userIds: [1, 2] },
        },
        result: { data: { createConversation: { id: 123 } } },
      },
    ];
    const { container, getByTestId, getByText } = render(
      <MemoryRouter>
        <ChatContext.Provider value={{ setChatState: jest.fn() }}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <NewConversation />
          </MockedProvider>
        </ChatContext.Provider>
      </MemoryRouter>,
    );

    const input = container.querySelector("input");
    fireEvent.change(input, { target: { value: "Jeremy" } });
    await wait(() => fireEvent.click(getByText("Jeremy Lane")));
    fireEvent.change(input, { target: { value: "John" } });
    await wait(() => fireEvent.click(getByText("John Thomas")));
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByText("Create"));
    await wait(() =>
      expect(getByTestId("redirect").dataset.to).toEqual("/chat/123"),
    );
  });
});
