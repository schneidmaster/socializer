import React, { Fragment, useEffect } from "react";
import { FeedItem, NewItem } from "components";

const Feed = ({ feedType, items, createParams, subscribeToNew }) => {
  useEffect(() => {
    subscribeToNew();
  }, []);

  return (
    <Fragment>
      <NewItem feedType={feedType} params={createParams} />
      {items.map((item) => (
        <FeedItem key={item.id} item={item} feedType={feedType} />
      ))}
    </Fragment>
  );
};

export default Feed;
