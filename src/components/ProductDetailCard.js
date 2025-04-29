import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // To handle navigation

export default function ProductDetailCard({
    product,
    quantity,
    handleQuantityChange,
    subtotal,
    handleAddToCart,
    loading
}) {
    const navigate = useNavigate();

    // Function to fetch image overrides from localStorage
    const getLocalImageOverrides = () => {
        const overrides = localStorage.getItem('imageOverrides');
        return overrides ? JSON.parse(overrides) : {};
    };

    // Function to get the image URL (either from localStorage or the default one)
    const getImageUrl = () => {
        const overrides = getLocalImageOverrides();
        return (
            overrides[product._id] ||
            product.imageUrl ||
            'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ='
        );
    };
    

    // Format price with commas and two decimal places
    const formatPrice = (amount) => {
        return amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Function to handle navigation to the product detail page
    const handleViewProduct = () => {
        navigate(`/products/${product._id}`);
    };

    return (
        <div className="product-detail-container">
            <Card className="product-detail-card shadow-lg rounded">
                <Card.Body className="p-4">
                    <div className="d-flex">
                        {/* Image on the left */}
                        <div className="product-image-container mb-4 me-4" onClick={handleViewProduct}>
                            <img
                                src={getImageUrl()}
                                alt={product.name}
                                className="product-image"
                                style={{ cursor: 'pointer', width: '200px', height: '200px', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Product details on the right */}
                        <div className="ms-0">
                            <h3 className="text-start mb-3">{product.name}</h3>

                            <Card.Text className="mb-3 product-description">
                                {product.description}
                            </Card.Text>

                            {/* Price */}
                            <Card.Text className="mb-3">
                                <strong>Price:</strong> ₱{formatPrice(product.price)}
                            </Card.Text>

                            <div className="d-flex align-items-center mb-3">
                                <span className="me-2"><strong>Quantity:</strong></span>
                                <InputGroup className="product-detail-quantity">
                                    <Button 
                                        variant="outline-dark" 
                                        onClick={() => handleQuantityChange('decrement')} 
                                        disabled={quantity <= 1}
                                        className="btn-sm"
                                        style={{ width: '30px', height: '30px', fontSize: '14px' }}
                                    >
                                        -
                                    </Button>
                                    <Form.Control 
                                        type="text" 
                                        value={quantity} 
                                        readOnly 
                                        className="text-center product-detail-quantity-display"
                                        style={{ width: '40px', height: '30px', fontSize: '14px', padding: '0' }}
                                    />
                                    <Button 
                                        variant="outline-dark" 
                                        onClick={() => handleQuantityChange('increment')}
                                        className="btn-sm"
                                        style={{ width: '30px', height: '30px', fontSize: '14px' }}
                                    >
                                        +
                                    </Button>
                                </InputGroup>
                            </div>

                            {/* Add to Cart Button */}
                            <Button 
                                variant="primary" 
                                onClick={handleAddToCart} 
                                disabled={loading || !product}
                                className="product-detail-add-to-cart w-100"
                            >
                                {loading ? 'Adding...' : 'Add to Cart'}
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
