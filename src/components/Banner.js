// src/components/Banner.js
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Banner() {
    return (
        <div className="banner-section">
            <div className="banner-overlay">
                <Container>
                    <Row className="justify-content-end align-items-center" style={{ height: '100%' }}>
                        <Col xs={12} md={6} className="text-end text-white">
                            <h1 className="fw-bold">AuraHome</h1>
                            <p className="lead">Breathe Life Into Your Space — Elegant Furniture, Effortlessly Yours.</p>
                            <Link className="btn btn-light" to="/products">Shop the Collection</Link>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}