import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("renders correctly for not found error", () => {
    const { container } = render(
      <MemoryRouter>
        <ErrorMessage message="GraphQL error: Not found" />
      </MemoryRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly for other error", () => {
    const { container } = render(
      <MemoryRouter>
        <ErrorMessage message="GraphQL error: Something" />
      </MemoryRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
