import React from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

const ErrorMessage = ({ message }) => {
  const is404 = message === "GraphQL error: Not found";
  return (
    <div className="d-flex justify-content-center">
      <Card>
        <Card.Body>
          <Card.Title>{is404 ? "Not found" : "Error"}</Card.Title>
          <Card.Text>
            {is404
              ? "The page you were looking for doesn't seem to exist."
              : "Something went wrong, sorry about that."}
          </Card.Text>
          <Link to="/">
            <Button variant="primary">Go home</Button>
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ErrorMessage;
