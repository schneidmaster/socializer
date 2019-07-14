import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "util/context";
import Signup, { SIGNUP } from "./Signup";

jest.mock("react-router-dom", () => ({
  MemoryRouter: jest.requireActual("react-router-dom").MemoryRouter,
  Redirect: () => <div className="redirect" />,
}));

describe("Signup", () => {
  it("renders correctly when authenticated", () => {
    const { container } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ token: "abc", setAuth: jest.fn() }}>
          <MockedProvider mocks={[]} addTypename={false}>
            <Signup />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when unauthenticated", () => {
    const { container } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ setAuth: jest.fn() }}>
          <MockedProvider mocks={[]} addTypename={false}>
            <Signup />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it("signs up", async () => {
    const mocks = [
      {
        request: {
          query: SIGNUP,
          variables: {
            name: "John Lvh",
            email: "john@lvh.me",
            password: "password",
          },
        },
        result: { data: { signUp: { id: 123, token: "abc" } } },
      },
    ];
    const setAuth = jest.fn();
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ setAuth }}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Signup />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    fireEvent.change(getByLabelText("Name"), {
      target: { value: "John Lvh" },
    });
    fireEvent.change(getByLabelText("Email address"), {
      target: { value: "john@lvh.me" },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(getByText("Sign up"));
    await wait(() => expect(setAuth).toBeCalledWith({ id: 123, token: "abc" }));
  });
});
