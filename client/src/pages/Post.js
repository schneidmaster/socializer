import React, { useCallback } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import produce from "immer";
import { ChatBar, Feed, FeedItem, QueryResult } from "components";

export const GET_POST = gql`
  query GetPost($id: String!) {
    post(id: $id) {
      id
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

export const COMMENTS_SUBSCRIPTION = gql`
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

const Post = ({
  match: {
    params: { id },
  },
}) => {
  const { subscribeToMore, ...queryResult } = useQuery(GET_POST, {
    variables: { id },
  });

  const subscribeToNew = useCallback(
    () =>
      subscribeToMore({
        document: COMMENTS_SUBSCRIPTION,
        variables: { postId: id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newComment = subscriptionData.data.commentCreated;

          // Check that we don't already have
          // the comment stored.
          if (
            prev.post.comments.find((comment) => comment.id === newComment.id)
          ) {
            return prev;
          }

          return produce(prev, (next) => {
            next.post.comments.push(newComment);
          });
        },
      }),
    [id],
  );

  return (
    <>
      <Helmet>
        <title>Socializer | Discussion</title>
        <meta property="og:title" content="Socializer | Discussion" />
      </Helmet>
      <Container>
        <QueryResult {...queryResult}>
          {({ data }) => (
            <Row>
              <Col md={4} className="d-none d-md-block">
                <ChatBar />
              </Col>
              <Col xs={12} md={8}>
                <h4>Discussion</h4>
                <FeedItem item={data.post} />
                <hr />
                <h5>Comments</h5>
                <Feed
                  feedType="comment"
                  newItemPosition="bottom"
                  items={data.post.comments}
                  createParams={{ postId: id }}
                  subscribeToNew={subscribeToNew}
                />
              </Col>
            </Row>
          )}
        </QueryResult>
      </Container>
    </>
  );
};

export default Post;
