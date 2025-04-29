import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Table, InputGroup, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const notyf = new Notyf();  // Create an instance of Notyf
    const navigate = useNavigate(); // 🆕 Add this for navigation

    const fetchCart = async () => {
        try {
            const response = await fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/cart/get-cart', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart data');
            }

            const data = await response.json();
            setCart(data.cart);
            setLoading(false);
        } catch (err) {
            setError('Could not fetch cart data.');
            setLoading(false);
        }
    };

    const handleQuantityChange = async (productId, action) => {
        try {
            const updatedCart = { ...cart };
            const item = updatedCart.cartItems.find(i => i.productId === productId);
            if (!item) return;

            const unitPrice = item.subtotal / item.quantity;

            if (action === 'increment') {
                item.quantity += 1;
            } else if (action === 'decrement' && item.quantity > 1) {
                item.quantity -= 1;
            }

            item.subtotal = item.quantity * unitPrice;
            updatedCart.totalPrice = updatedCart.cartItems.reduce((total, i) => total + i.subtotal, 0);
            setCart(updatedCart);

            const response = await fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/cart/update-cart-quantity', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: productId,
                    newQuantity: item.quantity,
                }),
            });

            if (!response.ok) {
                throw new Error('Error updating quantity');
            }

        } catch (err) {
            console.error('Error updating quantity:', err);
        }
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            const response = await fetch(`https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/cart/${productId}/remove-from-cart`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove item from cart');
            }

            const updatedCartItems = cart.cartItems.filter(item => item.productId !== productId);
            const updatedTotalPrice = updatedCartItems.reduce((total, item) => total + item.subtotal, 0);

            setCart({
                ...cart,
                cartItems: updatedCartItems,
                totalPrice: updatedTotalPrice,
            });

            notyf.success('Item removed from cart!');

        } catch (err) {
            console.error('Error removing item from cart:', err.message);
            notyf.error('Failed to remove item from cart');
        }
    };

    const handleClearCart = async () => {
        try {
            const response = await fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/cart/clear-cart', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to clear cart');
            }

            setCart({
                ...cart,
                cartItems: [],
                totalPrice: 0,
            });

            notyf.success('Cart cleared successfully!');

        } catch (err) {
            console.error('Error clearing the cart:', err.message);
            notyf.error('Failed to clear cart');
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Row className="my-4">
            <Col md={12}>
                <h2>Your Shopping Cart</h2>
                {cart && cart.cartItems.length === 0 ? (
                    <div>Your cart is empty.</div>
                ) : (
                    <Table bordered style={{ tableLayout: 'fixed', width: '100%' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#333', color: 'white' }}>
                                <th style={{ width: '30%' }}>Name</th>
                                <th style={{ width: '15%' }}>Price</th>
                                <th style={{ width: '15%' }}>Quantity</th>
                                <th style={{ width: '15%' }}>Subtotal</th>
                                <th style={{ width: '25%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.cartItems.map(item => (
                                <tr key={item._id}>
                                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.productName}
                                    </td>
                                    <td>₱{item.subtotal / item.quantity}</td>
                                    <td>
                                        <InputGroup style={{ width: '120px' }}>
                                            <Button
                                                variant="dark"
                                                onClick={() => handleQuantityChange(item.productId, 'decrement')}
                                                disabled={item.quantity <= 1}
                                                style={{
                                                    border: '1px solid #333',
                                                    borderRight: 'none',
                                                    backgroundColor: item.quantity <= 1 ? '#6c757d' : '#343a40',
                                                    color: 'white',
                                                }}
                                            >
                                                -
                                            </Button>
                                            <Form.Control
                                                type="text"
                                                value={item.quantity}
                                                readOnly
                                                className="text-center"
                                                style={{ border: '1px solid #333' }}
                                            />
                                            <Button
                                                variant="dark"
                                                onClick={() => handleQuantityChange(item.productId, 'increment')}
                                                style={{
                                                    border: '1px solid #333',
                                                    borderLeft: 'none',
                                                    backgroundColor: '#343a40',
                                                    color: 'white',
                                                }}
                                            >
                                                +
                                            </Button>
                                        </InputGroup>
                                    </td>
                                    <td>₱{item.subtotal}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleRemoveFromCart(item.productId)}
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                
                {/* ✨ Here are the TWO BUTTONS side-by-side */}
                <div className="d-flex mt-3">
                    <Button variant="danger" onClick={handleClearCart} className="me-2">
                        Clear Cart
                    </Button>
                    <Button variant="success" onClick={() => navigate('/checkout')}>
                        Check Out
                    </Button>
                </div>

            </Col>
        </Row>
    );
}
