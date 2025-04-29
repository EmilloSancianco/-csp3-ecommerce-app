// src/pages/ProductDetail.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import ProductDetailCard from '../components/ProductDetailCard'; // Import the new component

const notyf = new Notyf();

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        fetchProductDetails(id);
    }, [id]);

    const fetchProductDetails = async (productId) => {
        try {
            const response = await fetch(`https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/products/${productId}`);
            const data = await response.json();
            setProduct(data);
            setLoading(false);
            setSubtotal(data.price);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    const handleQuantityChange = (action) => {
        let newQuantity = quantity;
        if (action === 'increment') {
            newQuantity = quantity + 1;
        } else if (action === 'decrement' && quantity > 1) {
            newQuantity = quantity - 1;
        }
        setQuantity(newQuantity);
        if (product) {
            setSubtotal(newQuantity * product.price);
        }
    };

    const handleAddToCart = async () => {
        try {
            const response = await fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/cart/add-to-cart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: product._id,
                    quantity: quantity,
                    subtotal: subtotal
                })
            });

            const data = await response.json();

            if (response.ok) {
                notyf.success('Added to cart!');
                setTimeout(() => {
                    navigate('/cart');
                }, 1000);
            } else {
                notyf.error(data.message || 'Failed to add to cart.');
            }
        } catch (err) {
            notyf.error('An error occurred while adding to cart.');
            console.error(err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || !product) {
        return <div>Something went wrong. Please try again later.</div>;
    }

    return (
        <ProductDetailCard
            product={product}
            quantity={quantity}
            handleQuantityChange={handleQuantityChange}
            subtotal={subtotal}
            handleAddToCart={handleAddToCart}
            loading={loading}
        />
    );
}
