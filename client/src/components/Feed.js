import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { FeedItem, NewItem } from "components";

const Feed = ({ feedType, items, createParams, subscribeToNew }) => {
  useEffect(() => {
    subscribeToNew();
  }, []);

  return (
    <Row>
      <Col xs={12} md={8}>
        <NewItem feedType={feedType} params={createParams} />
        {items.map((item) => (
          <FeedItem key={item.id} item={item} feedType={feedType} />
        ))}
      </Col>
    </Row>
  );
};

export default Feed;
