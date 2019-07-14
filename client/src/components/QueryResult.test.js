import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import QueryResult from "./QueryResult";

describe("QueryResult", () => {
  it("renders correctly when loading", () => {
    const { container } = render(<QueryResult loading />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly when error", () => {
    const { container } = render(
      <MemoryRouter>
        <QueryResult error={{ message: "Oops" }} />
      </MemoryRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly when data is ready", () => {
    const { container } = render(
      <QueryResult data={{ name: "Sam" }}>
        {({ data }) => <div>{data.name}</div>}
      </QueryResult>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
