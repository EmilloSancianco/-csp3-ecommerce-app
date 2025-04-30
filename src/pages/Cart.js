import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useNavigate } from 'react-router-dom';
import CartTable from '../components/CartTable';
import Loading from '../components/Loading';

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                throw new Error('Failed to fetch cart data');
            }

            const data = await response.json();
            if (!data.cart) {
                setError('Your cart is empty. Please add products to your cart first.');
            } else {
                setCart(data.cart);
            }
            setLoading(false);
        } catch (err) {
            setError('No cart found. Add a product to create one.');
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

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
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
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
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
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
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

    const handleCheckout = () => {
        if (cart && cart.cartItems.length === 0) {
            notyf.error('Your cart is empty. Cannot proceed to checkout.');
        } else {
            navigate('/checkout'); // Navigate only if there are products in the cart
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading) {
        return <Loading message="Loading your cart..." />;  // Use the Loading component here
    }

    if (error) {
        return (
            <Row className="mt-5 pt-5">
                <Col md={12}>
                    <h2>Your Shopping Cart</h2>
                    <div>{error}</div> {/* Display error message if cart doesn't exist */}
                </Col>
            </Row>
        );
    }

    return (
        <Row className="mt-5 pt-5">
            <Col md={12}>
                <h2>Your Shopping Cart</h2>
                {cart && cart.cartItems.length === 0 ? (
                    <div>Your cart is empty. Please add products to your cart first.</div>
                ) : (
                    <CartTable
                        cartItems={cart.cartItems}
                        onQuantityChange={handleQuantityChange}
                        onRemoveFromCart={handleRemoveFromCart}
                    />
                )}

                <div className="d-flex mt-3">
                    <Button 
                        variant="danger" 
                        onClick={handleClearCart} 
                        className="me-2" 
                        disabled={cart && cart.cartItems.length === 0} // Disable the button if cart is empty
                    >
                        Clear Cart
                    </Button>
                    <Button 
                        variant="success" 
                        onClick={handleCheckout} 
                        disabled={cart && cart.cartItems.length === 0} // Disable the button if cart is empty
                    >
                        Check Out
                    </Button>
                </div>
            </Col>
        </Row>
    );
}
