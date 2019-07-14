import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import tk from "timekeeper";
import FeedItem from "./FeedItem";

describe("FeedItem", () => {
  const item = {
    id: 123,
    body: "Some thoughts",
    insertedAt: "2019-04-17T16:00:00",
    user: {
      name: "John Smith",
      gravatarMd5: "abcdefg",
    },
  };

  beforeEach(() => {
    tk.freeze("2019-04-18");
  });

  afterEach(() => {
    tk.reset();
  });

  it("renders correctly for post", () => {
    const { container } = render(
      <MemoryRouter>
        <FeedItem feedType="post" item={item} />,
      </MemoryRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly for comment", () => {
    const { container } = render(
      <MemoryRouter>
        <FeedItem feedType="comment" item={item} />,
      </MemoryRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
