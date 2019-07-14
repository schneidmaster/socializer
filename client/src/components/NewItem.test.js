import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "util/context";
import NewItem, { CREATE_POST, CREATE_COMMENT } from "./NewItem";

describe("NewItem", () => {
  it("renders correctly when not authenticated", () => {
    const { container } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{}}>
          <MockedProvider mocks={[]} addTypename={false}>
            <NewItem feedType="post" />
          </MockedProvider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  describe("when creating new post", () => {
    it("renders correctly", () => {
      const { container } = render(
        <MemoryRouter>
          <AuthContext.Provider value={{ token: "abc" }}>
            <MockedProvider mocks={[]} addTypename={false}>
              <NewItem feedType="post" />
            </MockedProvider>
          </AuthContext.Provider>
        </MemoryRouter>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("creates new comment", async () => {
      const mocks = [
        {
          request: {
            query: CREATE_POST,
            variables: { body: "New post" },
          },
          result: { data: { createPost: { id: 123 } } },
        },
      ];
      const { getByPlaceholderText, getByText } = render(
        <MemoryRouter>
          <AuthContext.Provider value={{ token: "abc" }}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <NewItem feedType="post" />
            </MockedProvider>
          </AuthContext.Provider>
        </MemoryRouter>,
      );
      fireEvent.change(getByPlaceholderText("What's on your mind?"), {
        target: { value: "New post" },
      });
      fireEvent.click(getByText("Submit"));
      await wait(() =>
        expect(getByPlaceholderText("What's on your mind?").value).toEqual(""),
      );
    });
  });

  describe("when creating new comment", () => {
    it("renders correctly", () => {
      const { container } = render(
        <MemoryRouter>
          <AuthContext.Provider value={{ token: "abc" }}>
            <MockedProvider mocks={[]} addTypename={false}>
              <NewItem feedType="comment" params={{ postId: 123 }} />
            </MockedProvider>
          </AuthContext.Provider>
        </MemoryRouter>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("creates new comment", async () => {
      const mocks = [
        {
          request: {
            query: CREATE_COMMENT,
            variables: { body: "New comment", postId: 123 },
          },
          result: { data: { createComment: { id: 456 } } },
        },
      ];
      const { getByPlaceholderText, getByText } = render(
        <MemoryRouter>
          <AuthContext.Provider value={{ token: "abc" }}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <NewItem feedType="comment" params={{ postId: 123 }} />
            </MockedProvider>
          </AuthContext.Provider>
        </MemoryRouter>,
      );
      fireEvent.change(getByPlaceholderText("What's on your mind?"), {
        target: { value: "New comment" },
      });
      fireEvent.click(getByText("Submit"));
      await wait(() =>
        expect(getByPlaceholderText("What's on your mind?").value).toEqual(""),
      );
    });
  });
});
