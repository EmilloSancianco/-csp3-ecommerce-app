import { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import ProductCard from '../components/ProductsCard';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [error, setError] = useState('');

    // Fetch all products on load
    useEffect(() => {
        fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/products/active')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data);
                    setFilteredProducts(data); // Initially show all products
                    setError(''); // Clear error if products load successfully
                } else {
                    setProducts([]);
                    setFilteredProducts([]);
                    setError('Failed to load products');
                }
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setError('An error occurred while fetching products');
            });
    }, []);

    // Handle search by name or price (or both)
    const handleSearch = () => {
        let results = [...products]; // Start with all products

        // Search by name if searchName is provided
        if (searchName !== '') {
            results = results.filter(product =>
                product.name.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        // Search by price range if minPrice or maxPrice is provided
        if (minPrice !== '' || maxPrice !== '') {
            const min = parseFloat(minPrice) || 0;
            const max = parseFloat(maxPrice) || Infinity;

            results = results.filter(product => {
                const price = parseFloat(product.price);
                return price >= min && price <= max;
            });
        }

        setFilteredProducts(results);
    };

    return (
        <div className="mt-5">
            <h1 className="text-left mb-4">Products</h1>

            <div className="search-filters mb-4">
                <Row className="justify-content-start">
                    {/* Name Search Field */}
                    <Col xs={12} sm={6} md={5}>
                        <Form.Group controlId="searchByName">
                            <Form.Control
                                type="text"
                                placeholder="Search by name"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                            />
                        </Form.Group>
                    </Col>

                    {/* Min and Max Price Fields */}
                    <Col xs={4} sm={2} md={1}>
                        <Form.Group controlId="minPrice">
                            <Form.Control
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={4} sm={2} md={1}>
                        <Form.Group controlId="maxPrice">
                            <Form.Control
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Search Button */}
                <Row className="justify-content-start mt-3">
                    <Col xs={12} sm={4} md={3}>
                        <Button variant="primary" onClick={handleSearch} block>
                            Search
                        </Button>
                    </Col>
                </Row>
            </div>

            {error && <p className="text-danger text-center">{error}</p>}

            <Row className="justify-content-center g-4">
                {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
                    <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
        </div>
    );
}
