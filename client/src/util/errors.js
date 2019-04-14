import { camelizeKeys } from "humps";

export const errorHash = ({ graphQLErrors } = {}) => {
  if (!Array.isArray(graphQLErrors)) return {};
  return camelizeKeys(
    graphQLErrors.reduce(
      (hash, error) => Object.assign(hash, { [error.field]: error.message }),
      {},
    ),
  );
};
