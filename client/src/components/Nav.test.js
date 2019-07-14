import React from "react";
import { render, wait } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "util/context";
import Nav, { GET_USER_INFO } from "./Nav";

describe("Nav", () => {
  it("renders correctly when unauthenticated", () => {
    const { container } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ token: null, setAuth: jest.fn() }}>
          <MockedProvider mocks={[]} addTypename={false}>
            <Nav />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when loading", () => {
    const mocks = [
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
    ];
    const { container } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ token: "abc", setAuth: jest.fn() }}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Nav />
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
    ];
    const { container, getByText } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ token: "abc", setAuth: jest.fn() }}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Nav />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    await wait(() => getByText("John Doe"));
    expect(container).toMatchSnapshot();
  });

  it("clears auth when loaded but token was stale", async () => {
    const mocks = [
      {
        request: {
          query: GET_USER_INFO,
        },
        result: {
          errors: [{ message: "Unauthenticated" }],
        },
      },
    ];
    const setAuth = jest.fn();
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ token: "abc", setAuth }}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Nav />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    await wait(() => expect(setAuth).toBeCalledWith(null));
  });
});
