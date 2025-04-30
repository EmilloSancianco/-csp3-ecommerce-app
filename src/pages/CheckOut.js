// src/pages/CheckOut.js
import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { useNavigate } from 'react-router-dom';
import CheckoutTable from '../components/CheckOutTable';
import Loading from '../components/Loading';  // Import the Loading component

export default function CheckOut() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const notyf = new Notyf();
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
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
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
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
            // Redirect to orders page after successful checkout
            navigate('/orders');

        } catch (err) {
            console.error('Checkout Error:', err.message);
            notyf.error(err.message || 'Checkout failed.');
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading) {
        return <Loading message="Loading your checkout..." />;  // Use the Loading component here
    }

    if (!cart || cart.cartItems.length === 0) {
        notyf.error('Your cart is empty. Nothing to checkout.');
        return <div></div>;
    }

    return (
        <Row className="mt-5 pt-5">
            <Col md={12}>
                <h2>Checkout Summary</h2>
                <CheckoutTable cartItems={cart.cartItems} />
                <h4>Total: ₱{cart.totalPrice}</h4>
                <Button variant="success" className="mt-3" onClick={handleCheckout}>
                    Place Order
                </Button>
            </Col>
        </Row>
    );
}
