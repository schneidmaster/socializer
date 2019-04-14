import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Timeago from "react-timeago";
import renderIf from "render-if";

const FeedItem = ({ feedType, item }) => {
  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div className="h6 mb-0">{item.user.name}</div>
        <div className="text-muted h7">
          <Timeago date={`${item.insertedAt}Z`} />
        </div>
      </Card.Header>
      <Card.Body>
        <p className="card-text">{item.body}</p>
      </Card.Body>
      {renderIf(feedType === "post")(
        <Card.Footer className="d-flex">
          <Link to={`/posts/${item.id}`} className="ml-auto">
            Discussion ≫
          </Link>
        </Card.Footer>,
      )}
    </Card>
  );
};

export default FeedItem;
