import { useEffect } from "react";

const Subscriber = ({ subscribeToNew, children }) => {
  useEffect(() => {
    subscribeToNew();
  }, []);

  return children;
};

export default Subscriber;
