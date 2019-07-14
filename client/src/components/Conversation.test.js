import React from "react";
import { render, wait } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { MemoryRouter } from "react-router-dom";
import { Subscriber } from "containers";
import { AuthContext } from "util/context";
import Conversation, {
  GET_CONVERSATION,
  MESSAGES_SUBSCRIPTION,
} from "./Conversation";

jest.mock("containers/Subscriber", () =>
  jest.fn().mockImplementation(({ children }) => children),
);

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

describe("Conversation", () => {
  it("renders correctly when loading", () => {
    const { container } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ userId: 1 }}>
          <MockedProvider mocks={[getMock]} addTypename={false}>
            <Conversation match={{ params: { id: 1 } }} />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when loaded", async () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ userId: 1 }}>
          <MockedProvider mocks={[getMock]} addTypename={false}>
            <Conversation match={{ params: { id: 1 } }} />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    await wait(() => getByText("Jane Peters, Jack Smith"));
    expect(container).toMatchSnapshot();
  });

  it("renders correctly after created message", async () => {
    Subscriber.mockImplementation((props) => {
      const { default: ActualSubscriber } = jest.requireActual(
        "containers/Subscriber",
      );
      return <ActualSubscriber {...props} />;
    });

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
