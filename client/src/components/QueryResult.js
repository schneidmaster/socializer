import React from "react";
import { ErrorMessage, Loading } from "components";

const QueryResult = ({ loading, error, data, children }) => {
  if (loading) {
    return <Loading />;
  } else if (error) {
    return <ErrorMessage message={error.message} />;
  } else {
    return children({ data });
  }
};

export default QueryResult;
