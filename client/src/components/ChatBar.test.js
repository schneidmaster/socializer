import React from "react";
import { render, fireEvent, wait } from "react-testing-library";
import { MockedProvider } from "react-apollo/test-utils";
import { MemoryRouter } from "react-router-dom";
import { AuthContext, ChatContext } from "util/context";
import ChatBar, {
  GET_CONVERSATIONS,
  CONVERSATIONS_SUBSCRIPTION,
  CONVERSATIONS_UPDATE_SUBSCRIPTION,
} from "./ChatBar";

const basicMocks = [
  {
    request: {
      query: GET_CONVERSATIONS,
    },
    result: {
      data: {
        conversations: [
          {
            id: 1,
            title: "Jane Smith, John Doe",
            updatedAt: "2019-04-18T00:00:00",
            users: [
              {
                id: 1,
                gravatarMd5: "abc",
              },
              {
                id: 2,
                gravatarMd5: "def",
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: CONVERSATIONS_SUBSCRIPTION,
      variables: { userId: 1 },
    },
    result: {
      data: null,
    },
  },
  {
    request: {
      query: CONVERSATIONS_UPDATE_SUBSCRIPTION,
      variables: { userId: 1 },
    },
    result: {
      data: null,
    },
  },
];

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "network-only",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  },
};

const renderChatBar = ({ authContext, chatContext, mocks } = {}) => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={authContext || { userId: 1 }}>
        <ChatContext.Provider
          value={
            chatContext || { chatState: "default", setChatState: jest.fn() }
          }
        >
          <MockedProvider
            mocks={mocks || basicMocks}
            addTypename={false}
            defaultOptions={defaultOptions}
          >
            <ChatBar />
          </MockedProvider>
        </ChatContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
};

describe("ChatBar", () => {
  it("renders correctly when unauthenticated", () => {
    const { container } = renderChatBar({ authContext: {} });
    expect(container).toMatchSnapshot();
  });

  it("renders correctly for loading state", () => {
    const { container } = renderChatBar();
    expect(container).toMatchSnapshot();
  });

  it("renders correctly for loaded state", async () => {
    const { container, getByText } = renderChatBar();
    await wait(() => getByText("Jane Smith, John Doe"));
    expect(container).toMatchSnapshot();
  });

  it("renders correctly after created conversation", async () => {
    const mocks = [
      basicMocks[0],
      {
        request: {
          query: CONVERSATIONS_SUBSCRIPTION,
          variables: { userId: 1 },
        },
        result: {
          data: {
            conversationCreated: {
              id: 2,
              title: "Jane Smith, Jeremy Peters",
              updatedAt: "2019-04-19T00:00:00",
              users: [
                {
                  id: 1,
                  gravatarMd5: "abc",
                },
                {
                  id: 3,
                  gravatarMd5: "ghi",
                },
              ],
            },
          },
        },
      },
      {
        request: {
          query: CONVERSATIONS_UPDATE_SUBSCRIPTION,
          variables: { userId: 1 },
        },
        result: {
          data: {
            conversationUpdated: {
              id: 1,
              title: "Jane Smith, John Doe",
              updatedAt: "2019-04-18T12:00:00",
              users: [
                {
                  id: 1,
                  gravatarMd5: "abc",
                },
                {
                  id: 2,
                  gravatarMd5: "def",
                },
              ],
            },
          },
        },
      },
    ];
    const { container, getByText } = renderChatBar({ mocks });
    await wait(() => getByText("Jane Smith, Jeremy Peters"));
    expect(container).toMatchSnapshot();
  });

  it("renders correctly for new chat state", () => {
    const { container } = renderChatBar({
      chatContext: {
        chatState: "creating",
        setChatState: jest.fn(),
      },
    });
    expect(container).toMatchSnapshot();
  });

  it("switches to new chat view", () => {
    const setChatState = jest.fn();
    const { getByText } = renderChatBar({
      chatContext: {
        chatState: "default",
        setChatState,
      },
    });
    fireEvent.click(getByText("New chat"));
    expect(setChatState).toBeCalledWith("creating");
  });
});
