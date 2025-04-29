import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ProductDetailCard({
    product,
    quantity,
    handleQuantityChange,
    subtotal,
    handleAddToCart,
    loading
}) {
    const navigate = useNavigate();

    const getLocalImageOverrides = () => {
        const overrides = localStorage.getItem('imageOverrides');
        return overrides ? JSON.parse(overrides) : {};
    };

    const getImageUrl = () => {
        const overrides = getLocalImageOverrides();
        return (
            overrides[product._id] ||
            product.imageUrl ||
            'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ='
        );
    };

    const formatPrice = (amount) => {
        return amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const handleViewProduct = () => {
        navigate(`/products/${product._id}`);
    };

    return (
        <div className="product-detail-container">
            <Card className="product-detail-card shadow-lg rounded square-card">
                <Card.Body className="p-4 h-100">
                    <div className="d-flex flex-column flex-md-row h-100">
                        {/* Image Section */}
                        <div
                            className="product-detail-image-container mb-4 mb-md-0 me-md-4 flex-shrink-0"
                            onClick={handleViewProduct}
                        >
                            <img
                                src={getImageUrl()}
                                alt={product.name}
                                className="product-detail-image img-fluid rounded"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="d-flex flex-column justify-content-between w-100">
                            <div>
                                <h3 className="text-start mb-3">{product.name}</h3>
                                <Card.Text className="mb-3 product-detail-description text-start">
                                    {product.description}
                                </Card.Text>
                                <Card.Text className="mb-3 text-start">
                                    <strong>Price:</strong> ₱{formatPrice(product.price)}
                                </Card.Text>
                            </div>

                            <div>
                                <div className="d-flex align-items-center mb-3">
                                    <span><strong>Quantity:</strong></span>
                                    <InputGroup className="mx-2" style={{ maxWidth: '140px' }}>
                                        <Button
                                            variant="dark"
                                            onClick={() => handleQuantityChange('decrement')}
                                            disabled={quantity <= 1}
                                            className="btn-sm"
                                        >
                                            -
                                        </Button>
                                        <Form.Control
                                            type="text"
                                            value={quantity}
                                            readOnly
                                            className="text-center"
                                        />
                                        <Button
                                            variant="dark"
                                            onClick={() => handleQuantityChange('increment')}
                                            className="btn-sm"
                                        >
                                            +
                                        </Button>
                                    </InputGroup>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={handleAddToCart}
                                    disabled={loading || !product}
                                    className="w-100"
                                >
                                    {loading ? 'Adding...' : 'Add to Cart'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
