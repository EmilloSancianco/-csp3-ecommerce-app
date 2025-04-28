import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function ProductDetail() {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null); // State to store product details
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for error handling
    const [cart, setCart] = useState([]); // Cart state (for adding items to cart)

    // Fetch product details from the API
    useEffect(() => {
        fetch(`https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/products/${id}`) // Replace with your actual API endpoint
            .then((response) => response.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [id]);

    // Handle adding product to cart
    const handleAddToCart = () => {
        setCart([...cart, product]);
        alert(`${product.name} has been added to your cart.`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching product details: {error.message}</div>;
    }

    if (!product) {
        return <div>Product not found!</div>;
    }

    return (
        <div className="product-detail-page">
            <h1>{product.name}</h1>
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-info">
                <p><strong>Description:</strong> {product.description}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <button onClick={handleAddToCart} className="add-to-cart-button">
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
