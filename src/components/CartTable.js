import React from 'react';
import { Table, Button, InputGroup, Form } from 'react-bootstrap';

const CartTable = ({ cartItems, onQuantityChange, onRemoveFromCart }) => {
  const formatPrice = (amount) => {
    return amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="table-responsive">
      <Table className="cart-table minimalistic-table">
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
                  {/* On Desktop: Display + and - buttons on either side */}
                  <div className="d-none d-md-flex flex-row">
                    <Button
                      variant="dark"
                      onClick={() => onQuantityChange(item.productId, 'decrement')}
                      disabled={item.quantity <= 1}
                      className="cart-quantity-button decrement"
                    >
                      -
                    </Button>
                    <Form.Control
                      type="text" // Use text input to avoid number input arrows
                      value={item.quantity}
                      onChange={(e) => onQuantityChange(item.productId, 'set', e.target.value)} // Allow typing quantity directly
                      className="text-center cart-quantity-display"
                      min={1}
                      disabled={false}
                    />
                    <Button
                      variant="dark"
                      onClick={() => onQuantityChange(item.productId, 'increment')}
                      className="cart-quantity-button increment"
                    >
                      +
                    </Button>
                  </div>

                  {/* On Mobile: Switch positions of + and - buttons */}
                  <div className="d-md-none">
                    <Button
                      variant="dark"
                      onClick={() => onQuantityChange(item.productId, 'increment')}
                      className="cart-quantity-button increment w-100"
                    >
                      +
                    </Button>
                    <Form.Control
                      type="text" // Use text input on mobile as well
                      value={item.quantity}
                      onChange={(e) => onQuantityChange(item.productId, 'set', e.target.value)} // Allow typing quantity directly
                      className="text-center cart-quantity-display"
                      min={1}
                      disabled={false}
                    />
                    <Button
                      variant="dark"
                      onClick={() => onQuantityChange(item.productId, 'decrement')}
                      disabled={item.quantity <= 1}
                      className="cart-quantity-button decrement w-100"
                    >
                      -
                    </Button>
                  </div>
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
    </div>
  );
};

export default CartTable;
