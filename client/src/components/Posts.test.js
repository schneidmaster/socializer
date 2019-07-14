import React from "react";
import { render, wait } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { MemoryRouter } from "react-router-dom";
import tk from "timekeeper";
import { Subscriber } from "containers";
import { AuthContext } from "util/context";
import Posts, { GET_POSTS, POSTS_SUBSCRIPTION } from "./Posts";

jest.mock("containers/Subscriber", () =>
  jest.fn().mockImplementation(({ children }) => children),
);

describe("Posts", () => {
  beforeEach(() => {
    tk.freeze("2019-04-20");
  });

  afterEach(() => {
    tk.reset();
  });

  it("renders correctly when loading", () => {
    const { container } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{}}>
          <MockedProvider mocks={[]} addTypename={false}>
            <Posts />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when loaded", async () => {
    const mocks = [
      {
        request: {
          query: GET_POSTS,
        },
        result: {
          data: {
            posts: [
              {
                id: 1,
                body: "Thoughts",
                insertedAt: "2019-04-18T00:00:00",
                user: {
                  id: 1,
                  name: "John Smith",
                  gravatarMd5: "abc",
                },
              },
            ],
          },
        },
      },
    ];
    const { container, getByText } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{}}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Posts />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    await wait(() => getByText("Thoughts"));
    expect(container).toMatchSnapshot();
  });

  it("renders correctly after created post", async () => {
    Subscriber.mockImplementation((props) => {
      const { default: ActualSubscriber } = jest.requireActual(
        "containers/Subscriber",
      );
      return <ActualSubscriber {...props} />;
    });

    const mocks = [
      {
        request: {
          query: GET_POSTS,
        },
        result: {
          data: {
            posts: [
              {
                id: 1,
                body: "Thoughts",
                insertedAt: "2019-04-18T00:00:00",
                user: {
                  id: 1,
                  name: "John Smith",
                  gravatarMd5: "abc",
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: POSTS_SUBSCRIPTION,
        },
        result: {
          data: {
            postCreated: {
              id: 2,
              body: "Opinions",
              insertedAt: "2019-04-19T00:00:00",
              user: {
                id: 2,
                name: "Jane Thompson",
                gravatarMd5: "def",
              },
            },
          },
        },
      },
    ];
    const { container, getByText } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{}}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Posts />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    await wait(() => getByText("Opinions"));
    expect(container).toMatchSnapshot();
  });
});
