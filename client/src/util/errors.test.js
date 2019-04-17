import { errorHash } from "./errors";

describe("errorHash", () => {
  it("correctly reduces array of errors to hash", () => {
    expect(
      errorHash({
        graphQLErrors: [{ field: "name", message: "Name can't be blank" }],
      }),
    ).toEqual({ name: "Name can't be blank" });
  });
});
