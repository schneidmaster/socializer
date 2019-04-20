import React from "react";
import { render, wait } from "react-testing-library";
import { MockedProvider } from "react-apollo/test-utils";
import { MemoryRouter } from "react-router-dom";
import tk from "timekeeper";
import { AuthContext, ChatContext } from "util/context";
import Post, { GET_POST, COMMENTS_SUBSCRIPTION } from "./Post";

const getMock = {
  request: {
    query: GET_POST,
    variables: { id: 1 },
  },
  result: {
    data: {
      post: {
        id: 1,
        body: "Here are a few thoughts",
        insertedAt: "2019-04-17T16:00:00",
        user: {
          id: 1,
          name: "Steven Paul",
          gravatarMd5: "abc",
        },
        comments: [
          {
            id: 1,
            body: "I agree!",
            insertedAt: "2019-04-17T18:00:00",
            user: {
              id: 2,
              name: "Patrick Lane",
              gravatarMd5: "def",
            },
          },
        ],
      },
    },
  },
};

const noNewCommentsMock = {
  request: {
    query: COMMENTS_SUBSCRIPTION,
    variables: { postId: 1 },
  },
  result: {
    data: null,
  },
};

describe("Post", () => {
  beforeEach(() => {
    tk.freeze("2019-04-20");
  });

  afterEach(() => {
    tk.reset();
  });

  it("renders correctly when loading", () => {
    const mocks = [getMock, noNewCommentsMock];

    const { container } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ userId: 1 }}>
          <ChatContext.Provider value={{ chatState: "default" }}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Post match={{ params: { id: 1 } }} />
            </MockedProvider>
          </ChatContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when loaded", async () => {
    const mocks = [getMock, noNewCommentsMock];

    const { container, getByText } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ userId: 1 }}>
          <ChatContext.Provider value={{ chatState: "default" }}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Post match={{ params: { id: 1 } }} />
            </MockedProvider>
          </ChatContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    await wait(() => getByText("Here are a few thoughts"));
    expect(container).toMatchSnapshot();
  });

  it("renders correctly after created comment", async () => {
    const mocks = [
      getMock,
      {
        request: {
          query: COMMENTS_SUBSCRIPTION,
          variables: { postId: 1 },
        },
        result: {
          data: {
            commentCreated: {
              id: 2,
              body: "Thanks for your support!",
              insertedAt: "2019-04-17T19:00:00",
              user: {
                id: 1,
                name: "Steven Paul",
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
          <ChatContext.Provider value={{ chatState: "default" }}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <Post match={{ params: { id: 1 } }} />
            </MockedProvider>
          </ChatContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    await wait(() => getByText("Thanks for your support!"));
    expect(container).toMatchSnapshot();
  });
});
