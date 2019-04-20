import React from "react";
import { render, wait } from "react-testing-library";
import { MockedProvider } from "react-apollo/test-utils";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "util/context";
import Conversation, {
  GET_CONVERSATION,
  MESSAGES_SUBSCRIPTION,
} from "./Conversation";

const getMock = {
  request: {
    query: GET_CONVERSATION,
    variables: { id: 1 },
  },
  result: {
    data: {
      conversation: {
        id: 1,
        title: "Jane Peters, Jack Smith",
        messages: [
          {
            id: 1,
            body: "Hi there",
            user: {
              id: 1,
              name: "Jane Peters",
              gravatarMd5: "abc",
            },
          },
          {
            id: 2,
            body: "Hello",
            user: {
              id: 2,
              name: "Jack Smith",
              gravatarMd5: "def",
            },
          },
        ],
      },
    },
  },
};

const noNewMessagesMock = {
  request: {
    query: MESSAGES_SUBSCRIPTION,
    variables: { conversationId: 1 },
  },
  result: {
    data: null,
  },
};

describe("Conversation", () => {
  it("renders correctly when loading", () => {
    const mocks = [getMock, noNewMessagesMock];

    const { container } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ userId: 1 }}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Conversation match={{ params: { id: 1 } }} />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when loaded", async () => {
    const mocks = [getMock, noNewMessagesMock];

    const { container, getByText } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ userId: 1 }}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Conversation match={{ params: { id: 1 } }} />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    await wait(() => getByText("Jane Peters, Jack Smith"));
    expect(container).toMatchSnapshot();
  });

  it("renders correctly after created message", async () => {
    const mocks = [
      getMock,
      {
        request: {
          query: MESSAGES_SUBSCRIPTION,
          variables: { conversationId: 1 },
        },
        result: {
          data: {
            messageCreated: {
              id: 3,
              body: "How's it going?",
              user: {
                id: 1,
                name: "Jane Peters",
                gravatarMd5: "abc",
              },
            },
          },
        },
      },
    ];
    const { container, getByText } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ userId: 1 }}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Conversation match={{ params: { id: 1 } }} />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    await wait(() => getByText("How's it going?"));
    expect(container).toMatchSnapshot();
  });
});
