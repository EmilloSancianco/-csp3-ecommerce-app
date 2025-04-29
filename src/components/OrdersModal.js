import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const OrdersModal = ({ show, onHide, orders, updateOrderStatus, removeOrder }) => {
  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>All Orders</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table table-striped text-center">
          <thead className="table-dark">
            <tr>
              <th>User ID</th>
              <th>Ordered On</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.userId}</td>
                  <td>{order.orderedOn ? new Date(order.orderedOn).toLocaleString() : 'N/A'}</td>
                  <td>
                    <ul className="list-unstyled">
                      {order.productsOrdered.map((product, index) => (
                        <li key={index}>
                          {product.name} x{product.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₱{order.totalPrice.toLocaleString()}</td>
                  <td>{order.status}</td>
                  <td>
                    <div className="d-flex flex-row justify-content-center align-items-center gap-2">
                      {order.status === 'Pending' && (
                        <Button
                          variant="success"
                          size="sm"
                          className="py-1 px-2"
                          onClick={() => updateOrderStatus(order._id, 'Processed')}
                        >
                          <span style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>Mark as Processed</span>
                        </Button>
                      )}
                      {order.status === 'Processed' && (
                        <Button
                          variant="info"
                          size="sm"
                          className="py-1 px-2"
                          onClick={() => updateOrderStatus(order._id, 'Completed')}
                        >
                          <span style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>Mark as Completed</span>
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        className="py-1 px-2"
                        onClick={() => removeOrder(order._id)}
                      >
                        <span style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>Remove Order</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No orders available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrdersModal;