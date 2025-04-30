import { Card } from 'react-bootstrap';
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

    // Truncate helper for the product name
    const truncateText = (text, maxLength, fallback = 'No content available') =>
        text && text.trim() !== ''
            ? (text.length > maxLength ? `${text.slice(0, maxLength)}...` : text)
            : fallback;

    const truncatedName = truncateText(product.name, 12, 'No name');

    return (
        <Card
            className="text-dark border-0 shadow-sm rounded-3 overflow-hidden product-card"
            onClick={handleViewProduct}
        >
            {/* Image Section with Darkened Overlay */}
            <div className="product-image-container">
                <Card.Img
                    variant="top"
                    src={getImageUrl()}
                    alt={product.name}
                    className="product-card-img"
                    loading="lazy"
                />
                <div className="product-image-overlay"></div>
            </div>

            <Card.Body className="d-flex flex-column justify-content-between p-3">
                <div className="description-wrapper">
                    {/* Truncated Product Title */}
                    <Card.Title className="product-card-title">
                        {truncatedName}
                    </Card.Title>
                </div>

                <div className="mt-3 d-flex flex-column align-items-start">
                    {/* Price */}
                    <Card.Text className="product-card-price">
                        <strong>Price:</strong> ₱{product.price.toLocaleString()}
                    </Card.Text>
                </div>
            </Card.Body>
        </Card>
    );
}
