// src/components/Loading.js
import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const Loading = ({ message = "Loading..." }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <h4 className="mt-3">{message}</h4>
      </div>
    </Container>
  );
};

export default Loading;
