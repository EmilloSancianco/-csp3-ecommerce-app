import React from 'react';
import { Button } from 'react-bootstrap';

const ProductsTable = ({ products, setSelectedProduct, setShowEditModal, toggleAvailability }) => {
  return (
    <table className="table table-striped text-center align-middle">
      <thead className="table-dark">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Availability</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products && products.length > 0 ? (
          products.map((product) => {
            // Ensure price is a number
            const price = typeof product.price === 'number' 
              ? product.price 
              : parseFloat(product.price) || 0;

            return (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>₱{price.toLocaleString('en-US')}</td>
                <td>{product.isActive ? 'Available' : 'Unavailable'}</td>
                <td className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant={product.isActive ? 'danger' : 'success'}
                    size="sm"
                    onClick={() => toggleAvailability(product)}
                  >
                    {product.isActive ? 'Disable' : 'Activate'}
                  </Button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="5">No products available.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ProductsTable;