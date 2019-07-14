import React from "react";
import { render } from "@testing-library/react";
import Subscriber from "./Subscriber";

describe("Subscriber", () => {
  it("invokes subscription and renders children", () => {
    const subscribeToNew = jest.fn();
    const { container } = render(
      <Subscriber subscribeToNew={subscribeToNew}>
        <p>Hello</p>
      </Subscriber>,
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(subscribeToNew).toBeCalled();
  });
});
