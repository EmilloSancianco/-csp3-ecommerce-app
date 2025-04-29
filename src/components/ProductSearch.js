// src/components/ProductSearch.js

import { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

export default function ProductSearch({ onSearch }) {
    const [searchName, setSearchName] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleSearch = () => {
        onSearch(searchName, minPrice, maxPrice);
    };

    return (
        <div className="search-filters mb-4">
            <Row className="gy-2">
                {/* Name Search Field */}
                <Col xs={12} sm={12} md={6} lg={5}>
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
                <Col xs={6} sm={6} md={2} lg={2}>
                    <Form.Group controlId="minPrice">
                        <Form.Control
                            type="number"
                            placeholder="Min price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={6} sm={6} md={2} lg={2}>
                    <Form.Group controlId="maxPrice">
                        <Form.Control
                            type="number"
                            placeholder="Max price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </Form.Group>
                </Col>

                {/* Search Button */}
                <Col xs={12} sm={12} md={3} lg={3} className="mt-2">
                    <Button variant="primary" onClick={handleSearch} className="w-100">
                        Search
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
