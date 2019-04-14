import React, { useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Timeago from "react-timeago";
import { NewPost } from "components";

const Posts = ({ posts, subscribeToNewPosts }) => {
  useEffect(() => {
    subscribeToNewPosts();
  }, []);

  return (
    <Row>
      <Col xs={8}>
        <NewPost />
        {posts.map((post) => (
          <Card key={post.id} className="mb-4">
            <Card.Header className="d-flex justify-content-between">
              <div className="h5">{post.user.name}</div>
              <div className="text-muted h7">
                <Timeago date={`${post.insertedAt}Z`} />
              </div>
            </Card.Header>
            <Card.Body>
              <p className="card-text">{post.body}</p>
            </Card.Body>
          </Card>
        ))}
      </Col>
    </Row>
  );
};

export default Posts;
