import React from "react";
import { render, fireEvent, wait } from "react-testing-library";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "react-apollo/test-utils";
import tk from "timekeeper";
import { GET_CONVERSATIONS } from "components/ChatBar";
import { GET_USER_INFO } from "components/Nav";
import { GET_POSTS } from "components/Posts";
import { LOGIN } from "pages/Login";
import App from "./App";

jest.mock("components/Subscriber", () => ({ children }) => children);

describe("App", () => {
  beforeEach(() => {
    tk.freeze("2019-04-20");
  });

  afterEach(() => {
    tk.reset();
  });

  it("successfully proceeds through user flow logging in and out", async () => {
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
          query: LOGIN,
          variables: { email: "john@lvh.me", password: "password" },
        },
        result: { data: { authenticate: { id: 123, token: "abc" } } },
      },
      {
        request: {
          query: GET_USER_INFO,
        },
        result: {
          data: {
            currentUser: {
              name: "John Doe",
            },
          },
        },
      },
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
    ];

    const { container, getByLabelText, getByTestId, getByText } = render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <App />
        </MockedProvider>
      </MemoryRouter>,
    );
    // Log in the user.
    fireEvent.click(getByText("Log in"));
    fireEvent.change(getByLabelText("Email address"), {
      target: { value: "john@lvh.me" },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: "password" },
    });
    fireEvent.submit(getByTestId("login-form"));
    await wait(() => getByText("John Doe"));

    // Check that the homepage renders correctly.
    expect(container).toMatchSnapshot();

    // Log back out.
    fireEvent.click(getByText("John Doe"));
    fireEvent.click(getByText("Log out"));
    await wait(() => getByText("Log in"));

    // Check that the homepage renders correctly.
    expect(container).toMatchSnapshot();
  });
});
