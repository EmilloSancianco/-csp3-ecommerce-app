import React, { useState, useEffect } from 'react';
import { Button, Table, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { useNavigate } from 'react-router-dom';
import 'notyf/notyf.min.css';

export default function CheckOut() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const notyf = new Notyf();
    const navigate = useNavigate();

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
                throw new Error('Failed to fetch cart');
            }

            const data = await response.json();
            setCart(data.cart);
        } catch (err) {
            console.error(err);
            notyf.error('Failed to load cart.');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        try {
            const response = await fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/orders/checkout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Checkout failed');
            }

            notyf.success('Order placed successfully!');
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            console.error('Checkout Error:', err.message);
            notyf.error(err.message || 'Checkout failed.');
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!cart || cart.cartItems.length === 0) {
        notyf.error('Your cart is empty. Nothing to checkout.');
        return <div></div>;
    }

    return (
        <Row className="my-4">
            <Col md={12}>
                <h2>Checkout Summary</h2>
                <Table bordered hover>
                    <thead>
                        <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.cartItems.map(item => (
                            <tr key={item._id}>
                                <td>{item.productName || 'Unnamed Product'}</td>
                                <td>₱{item.subtotal / item.quantity}</td>
                                <td>{item.quantity}</td>
                                <td>₱{item.subtotal}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <h4>Total: ₱{cart.totalPrice}</h4>
                <Button variant="success" className="mt-3" onClick={handleCheckout}>
                    Place Order
                </Button>
            </Col>
        </Row>
    );
}
