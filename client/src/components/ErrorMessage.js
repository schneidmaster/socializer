import React from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

const ErrorMessage = ({ message }) => {
  return (
    <div className="d-flex justify-content-center">
      <Card>
        <Card.Body>
          <Card.Title>Error</Card.Title>
          <Card.Text>Something went wrong, sorry about that.</Card.Text>
          <Link to="/app">
            <Button variant="primary">Go home</Button>
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ErrorMessage;
