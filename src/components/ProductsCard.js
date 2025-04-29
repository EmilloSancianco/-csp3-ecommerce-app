import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    // Function to fetch image overrides from localStorage
    const getLocalImageOverrides = () => {
        const overrides = localStorage.getItem('imageOverrides');
        return overrides ? JSON.parse(overrides) : {};
    };

    // Function to get the image URL (either from localStorage or the default one)
    const getImageUrl = () => {
        const overrides = getLocalImageOverrides();
        return overrides[product._id] || product.imageUrl || 'path/to/placeholder-image.jpg';
    };

    // Function to handle navigation to the product detail page
    const handleViewProduct = () => {
        navigate(`/products/${product._id}`);
    };

    // Function to render description safely
    const renderDescription = () => {
        // Check for null, undefined, or empty string
        if (!product.description || product.description.trim() === '') {
            return 'No description available';
        }
        return product.description;
    };

    return (
        <Card
            className="bg-dark text-white border-0 shadow-sm rounded-4 overflow-hidden product-card"
            onClick={handleViewProduct}
        >
            {/* Image Section */}
            <Card.Img
                variant="top"
                src={getImageUrl()}
                alt={product.name}
                className="product-card-img"
                loading="lazy"
            />
            <Card.Body className="d-flex flex-column justify-content-between p-3">
                <div>
                    {/* Product Title */}
                    <Card.Title className="fw-bold text-center text-truncate product-card-title">
                        {product.name}
                    </Card.Title>

                    {/* Product Description */}
                    <Card.Text className="text-center product-card-description">
                        {renderDescription()}
                    </Card.Text>
                </div>

                <div className="mt-3 d-flex flex-column align-items-center">
                    {/* Price Section */}
                    <Card.Text className="fs-5 mb-2 product-card-price">
                        <strong>Price:</strong> ₱{product.price}
                    </Card.Text>

                    {/* View Product Button */}
                    <Button
                        variant="light"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleViewProduct();
                        }}
                        className="text-uppercase fw-bold px-4 py-2 rounded-pill product-card-button"
                    >
                        View Product
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}