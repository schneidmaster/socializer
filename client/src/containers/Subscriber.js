import { useEffect } from "react";

const Subscriber = ({ subscribeToNew, children }) => {
  useEffect(() => {
    subscribeToNew();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
};

export default Subscriber;
