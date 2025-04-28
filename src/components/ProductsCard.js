import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    // Function to navigate to the product detail page
    const handleViewProduct = () => {
        console.log(product._id); // Or product.id based on your API response
        navigate(`/products/${product._id}`);
    };

    return (
        <Card 
            className="bg-dark text-white border-0 shadow-sm rounded-3" 
            style={{ transition: "transform 0.3s ease-in-out" }}
        >
            <Card.Body>
                <Card.Title className="fw-bold">{product.name}</Card.Title>
                <Card.Text className="text-muted">{product.description}</Card.Text>
                <Card.Text className="fs-5">
                    <strong>Price: </strong>${product.price}
                </Card.Text>
                <div className="d-flex justify-content-center">
                    <Button 
                        variant="secondary" 
                        onClick={handleViewProduct} 
                        className="text-uppercase fw-bold"
                    >
                        View Product
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}
