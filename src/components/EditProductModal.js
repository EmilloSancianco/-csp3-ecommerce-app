import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditProductModal = ({ show, onHide, selectedProduct, setSelectedProduct, handleEditProduct }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={selectedProduct?.name || ''}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={selectedProduct?.description || ''}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={selectedProduct?.price || ''}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image URL here"
              value={selectedProduct?.image || ''}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, image: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleEditProduct}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;