import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from './ProductsCard';

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`);
                const data = await res.json();

                // Shuffle and pick 5 random products
                const shuffled = data.sort(() => 0.5 - Math.random());
                setProducts(shuffled.slice(0, 5));
            } catch (err) {
                console.error('Failed to load products:', err);
            }
        };

        fetchProducts();
    }, []);

    return (
        <Container className="mt-5">
            <h2 className="mb-4 text-center">Featured Products</h2>
            <Row className="justify-content-center">
                {products.map((product) => (
                    <Col key={product._id} xs={6} sm={4} md={3} lg={2} className="mb-4">
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
            <div className="text-center mt-3">
                <Link to="/products">
                    <Button variant="primary">View All Products</Button>
                </Link>
            </div>
        </Container>
    );
}
