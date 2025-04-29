import React from 'react';
import { Table } from 'react-bootstrap';

const CheckoutTable = ({ cartItems }) => {
  const formatPrice = (amount) => {
    return amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div>
      <Table className="minimalistic-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item._id}>
              <td>{item.productName || 'Unnamed Product'}</td>
              <td>₱{formatPrice(item.subtotal / item.quantity)}</td>
              <td>{item.quantity}</td>
              <td>₱{formatPrice(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CheckoutTable;