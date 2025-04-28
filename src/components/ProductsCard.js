import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    // Function to navigate to the product detail page
    const handleViewProduct = () => {
        // Check and log the product ID to make sure it's valid
        console.log(product._id); // Or product.id based on your API response
        navigate(`/products/${product._id}`);
    };

    return (
        <Card className="product-card">
            <Card.Body>
                <Card.Title className="product-title">{product.name}</Card.Title>
                <Card.Text className="product-description">{product.description}</Card.Text>
                <Card.Text className="product-price">
                    <strong>Price: </strong>${product.price}
                </Card.Text>
                <div className="product-button">
                    <Button variant="primary" onClick={handleViewProduct}>
                        View Product
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}
