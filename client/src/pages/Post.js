import React, { Fragment } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Col, Container, Row } from "react-bootstrap";
import Helmet from "react-helmet";
import produce from "immer";
import { ChatBar, ErrorMessage, Feed, FeedItem, Loading } from "components";

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
  return (
    <Fragment>
      <Helmet>
        <title>Socializer | Discussion</title>
        <meta property="og:title" content="Socializer | Discussion" />
      </Helmet>
      <Container>
        <Query query={GET_POST} variables={{ id }}>
          {({ client, loading, error, data, subscribeToMore }) => {
            if (loading) return <Loading />;
            if (error) return <ErrorMessage message={error.message} />;
            return (
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
                    subscribeToNew={() =>
                      subscribeToMore({
                        document: COMMENTS_SUBSCRIPTION,
                        variables: { postId: id },
                        updateQuery: (prev, { subscriptionData }) => {
                          if (!subscriptionData.data) return prev;
                          const newComment =
                            subscriptionData.data.commentCreated;

                          // Check that we don't already have
                          // the comment stored.
                          if (
                            prev.post.comments.find(
                              (comment) => comment.id === newComment.id,
                            )
                          ) {
                            return prev;
                          }

                          return produce(prev, (next) => {
                            next.post.comments.push(newComment);
                          });
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
    </Fragment>
  );
};

export default Post;
