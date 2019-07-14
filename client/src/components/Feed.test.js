import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import tk from "timekeeper";
import Feed from "./Feed";

jest.mock("components/NewItem", () => () => "NewItemMock");

describe("Feed", () => {
  const items = [
    {
      id: 123,
      body: "Some thoughts",
      insertedAt: "2019-04-17T16:00:00",
      user: {
        name: "John Smith",
        gravatarMd5: "abcdefg",
      },
    },
  ];

  beforeEach(() => {
    tk.freeze("2019-04-18");
  });

  afterEach(() => {
    tk.reset();
  });

  it("renders correctly for post", () => {
    const subscribeToNew = jest.fn();
    const { container } = render(
      <MemoryRouter>
        <Feed
          feedType="post"
          items={items}
          createParams={{ postId: 123 }}
          subscribeToNew={subscribeToNew}
        />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
    expect(subscribeToNew).toBeCalled();
  });

  it("renders correctly for comment", () => {
    const subscribeToNew = jest.fn();
    const { container } = render(
      <MemoryRouter>
        <Feed
          feedType="comment"
          newItemPosition="bottom"
          items={items}
          subscribeToNew={subscribeToNew}
        />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
    expect(subscribeToNew).toBeCalled();
  });
});
