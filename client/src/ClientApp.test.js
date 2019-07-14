import React from "react";
import { render } from "@testing-library/react";
import ClientApp from "./ClientApp";

describe("ClientApp", () => {
  it("renders correctly", () => {
    const { container } = render(<ClientApp />);
    expect(container).toMatchSnapshot();
  });
});
