import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Card, Col, Container, Row } from "react-bootstrap";
import Timeago from "react-timeago";
import { ErrorMessage, Loading, NewPost } from "components";

const GET_POSTS = gql`
  {
    posts {
      id
      body
      insertedAt
      user {
        id
        name
      }
    }
  }
`;

const Home = () => {
  return (
    <Container>
      <Query query={GET_POSTS}>
        {({ client, loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return <ErrorMessage message={error.message} />;
          return (
            <Row>
              <Col xs={8}>
                <NewPost />
                {data.posts.map((post) => (
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
        }}
      </Query>
    </Container>
  );
};

export default Home;
