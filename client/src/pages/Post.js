import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Col, Container, Row } from "react-bootstrap";
import { ErrorMessage, Feed, FeedItem, Loading } from "components";

const GET_POST = gql`
  query GetPost($id: String!) {
    post(id: $id) {
      body
      insertedAt
      user {
        id
        name
        gravatarMd5
      }
      comments {
        id
        body
        insertedAt
        user {
          id
          name
          gravatarMd5
        }
      }
    }
  }
`;

const COMMENTS_SUBSCRIPTION = gql`
  subscription onCommentCreated($postId: String!) {
    commentCreated(postId: $postId) {
      id
      body
      insertedAt
      user {
        id
        name
        gravatarMd5
      }
    }
  }
`;

const Post = ({ match: { params } }) => {
  return (
    <Container>
      <Query query={GET_POST} variables={{ id: params.id }}>
        {({ client, loading, error, data, subscribeToMore }) => {
          if (loading) return <Loading />;
          if (error) return <ErrorMessage message={error.message} />;
          return (
            <Row>
              <Col xs={12} md={8}>
                <FeedItem item={data.post} />
                <hr />
                <h5>Comments</h5>
                <Feed
                  feedType="comment"
                  items={data.post.comments}
                  createParams={{ postId: params.id }}
                  subscribeToNew={() =>
                    subscribeToMore({
                      document: COMMENTS_SUBSCRIPTION,
                      variables: { postId: params.id },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev;
                        const newComment = subscriptionData.data.commentCreated;

                        prev.post.comments = [
                          newComment,
                          ...prev.post.comments,
                        ];
                        return prev;
                      },
                    })
                  }
                />
              </Col>
            </Row>
          );
        }}
      </Query>
    </Container>
  );
};

export default Post;
