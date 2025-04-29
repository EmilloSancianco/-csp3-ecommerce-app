import React from 'react';
import { Table } from 'react-bootstrap';

const OrderTable = ({ orders, productsMap }) => {
  return (
    <div className="table-responsive">
      <Table striped className="orders-table minimalistic-table">
        <thead>
          <tr>
            <th className="order-id-column">Order ID</th>
            <th className="date-ordered-column">Date Ordered</th>
            <th className="status-column">Status</th>
            <th className="product-details-column">Product Details</th>
            <th className="total-price-column">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            // Extract the Order ID and date from order._id if necessary
            const orderIdParts = order._id ? order._id.split('/') : [];
            const orderId = orderIdParts.length > 0 ? orderIdParts[0] : 'Unknown ID';
            const extractedDate = orderIdParts.length > 1 ? orderIdParts.slice(1).join('/') : null;

            // Use order.orderedOn if available, otherwise use the extracted date
            const orderedOn = order.orderedOn
              ? new Date(order.orderedOn).toLocaleDateString()
              : extractedDate
              ? extractedDate
              : 'Unknown Date';

            // Log for debugging
            if (order._id && order._id.includes('/')) {
              console.warn(
                `Malformed Order ID detected: ${order._id}. Extracted ID: ${orderId}, Date: ${orderedOn}`
              );
            }

            return (
              <tr key={order._id}>
                <td className="order-id-cell">{order._id}</td>
                <td className="date-ordered-cell">{orderedOn}</td>
                <td className="status-cell">{order.status}</td>
                <td className="product-details-cell">
                  <div>
                    {order.productsOrdered.map((product) => (
                      <div key={product._id} className="product-detail">
                        <strong>{productsMap[product.productId] || 'Unknown Product'}</strong>: {product.quantity} x ₱{product.subtotal.toLocaleString('en-US')}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="total-price-cell">
                  ₱{order.totalPrice.toLocaleString('en-US')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderTable;
