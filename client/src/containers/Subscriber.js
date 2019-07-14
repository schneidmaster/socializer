import { useEffect } from "react";

const Subscriber = ({ subscribeToNew, children }) => {
  useEffect(() => {
    subscribeToNew();
  }, [subscribeToNew]);

  return children;
};

export default Subscriber;
