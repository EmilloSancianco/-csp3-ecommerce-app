import React from 'react';
import { Button } from 'react-bootstrap';

const ProductsTable = ({ products, setSelectedProduct, setShowEditModal, toggleAvailability }) => {
  return (
    <div className="table-container">
      <table className="table table-striped text-center align-middle">
        <thead className="table-dark sticky-header">
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
              const price = typeof product.price === 'number' 
                ? product.price 
                : parseFloat(product.price) || 0;

              return (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>₱{price.toLocaleString('en-US')}</td>
                  <td>{product.isActive ? 'Available' : 'Unavailable'}</td>
                  <td className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-2">
                    {/* Edit Button */}
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-md-2 mb-2 mb-md-0 action-button edit-button"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </Button>

                    {/* Disable/Activate Button */}
                    <Button
                      variant={product.isActive ? 'danger' : 'success'}
                      size="sm"
                      className="mt-2 mt-md-0 action-button"
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
    </div>
  );
};

export default ProductsTable;
