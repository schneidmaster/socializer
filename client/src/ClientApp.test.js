import React from "react";
import { render } from "react-testing-library";
import ClientApp from "./ClientApp";

describe("ClientApp", () => {
  it("renders correctly", () => {
    const { container } = render(<ClientApp />);
    expect(container).toMatchSnapshot();
  });
});
