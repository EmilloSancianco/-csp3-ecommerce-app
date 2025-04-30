// src/pages/Products.js

import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductsCard';
import ProductSearch from '../components/ProductSearch';
import Loading from '../components/Loading'; // Import the Loading component

export default function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Added loading state

    // Fetch all products on load
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`)
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
                setLoading(false); // Set loading to false after data is fetched
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setError('An error occurred while fetching products');
                setLoading(false); // Set loading to false if there's an error
            });
    }, []);

    // Handle search by name or price (or both)
    const handleSearch = (searchName, minPrice, maxPrice) => {
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

    // Show loading spinner if loading is true
    if (loading) {
        return <Loading message="Loading products..." />;
    }

    return (
        <div className="mt-5 pt-5"> {/* Add padding-top to ensure space for navbar */}
            <h1 className="text-left mb-4">Products</h1>

            <ProductSearch onSearch={handleSearch} />

            {error && <p className="text-danger text-center">{error}</p>}

            <Row className="justify-content-center g-4">
                {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
                     <Col key={product._id} xs={6} sm={6} md={4} lg={3} xl={2}>
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
        </div>
    );
}
