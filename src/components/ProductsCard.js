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
        return (
            overrides[product._id] ||
            product.imageUrl ||
            'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ='
        );
    };
    

    // Function to handle navigation to the product detail page
    const handleViewProduct = () => {
        navigate(`/products/${product._id}`);
    };

    // Limit description to 100 characters and add ellipsis if necessary
    const maxLength = 30;
    const truncatedDescription = product.description && product.description.trim() !== ''
        ? (product.description.length > maxLength 
            ? `${product.description.slice(0, maxLength)}...`
            : product.description)
        : 'No description available';

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
                <div className="description-wrapper">
                    {/* Product Title */}
                    <Card.Title className="fw-bold text-center product-card-title">
                        {product.name}
                    </Card.Title>

                    {/* Product Description */}
                    <Card.Text className="text-center product-card-description">
                        {truncatedDescription}
                    </Card.Text>
                </div>

                <div className="mt-3 d-flex flex-column align-items-center">
                    {/* Price Section */}
                    <Card.Text className="fs-5 mb-2 product-card-price">
                        <strong>Price:</strong> ₱{product.price.toLocaleString()}
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
