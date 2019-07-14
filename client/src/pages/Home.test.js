import React from "react";
import { render } from "@testing-library/react";
import Home from "./Home";

jest.mock("components", () => ({
  ChatBar: () => <div className="chat-bar" />,
  Posts: () => <div className="posts" />,
}));

describe("Home", () => {
  it("renders correctly", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
});
