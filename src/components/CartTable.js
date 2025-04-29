// src/components/CartTable.js
import React from 'react';
import { Table, Button, InputGroup, Form } from 'react-bootstrap';

const CartTable = ({ cartItems, onQuantityChange, onRemoveFromCart }) => {
  const formatPrice = (amount) => {
    return amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Table bordered className="cart-table">
      <thead>
        <tr className="cart-table-header">
          <th className="cart-table-name">Name</th>
          <th className="cart-table-price">Price</th>
          <th className="cart-table-quantity">Quantity</th>
          <th className="cart-table-subtotal">Subtotal</th>
          <th className="cart-table-actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        {cartItems.map(item => (
          <tr key={item._id}>
            <td className="cart-table-name-cell">{item.productName}</td>
            <td>₱{formatPrice(item.subtotal / item.quantity)}</td>
            <td>
              <InputGroup className="cart-quantity-input">
                <Button
                  variant="dark"
                  onClick={() => onQuantityChange(item.productId, 'decrement')}
                  disabled={item.quantity <= 1}
                  className="cart-quantity-button decrement"
                >
                  -
                </Button>
                <Form.Control
                  type="text"
                  value={item.quantity}
                  readOnly
                  className="text-center cart-quantity-display"
                />
                <Button
                  variant="dark"
                  onClick={() => onQuantityChange(item.productId, 'increment')}
                  className="cart-quantity-button increment"
                >
                  +
                </Button>
              </InputGroup>
            </td>
            <td>₱{formatPrice(item.subtotal)}</td>
            <td>
              <Button
                variant="danger"
                onClick={() => onRemoveFromCart(item.productId)}
              >
                Remove
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CartTable;
