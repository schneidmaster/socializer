import React from "react";
import renderIf from "render-if";
import { FeedItem, NewItem } from "components";
import { Subscriber } from "containers";

const Feed = ({
  feedType,
  items,
  createParams,
  subscribeToNew,
  newItemPosition = "top",
}) => {
  return (
    <Subscriber subscribeToNew={subscribeToNew}>
      {renderIf(newItemPosition === "top")(
        <NewItem feedType={feedType} params={createParams} />,
      )}
      {items.map((item) => (
        <FeedItem key={item.id} item={item} feedType={feedType} />
      ))}
      {renderIf(newItemPosition === "bottom")(
        <NewItem feedType={feedType} params={createParams} />,
      )}
    </Subscriber>
  );
};

export default Feed;
