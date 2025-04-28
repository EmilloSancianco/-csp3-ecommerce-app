import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {


    return (
        <Row>
            <Col className="mt-5 pt-5 text-center mx-auto">
                <h1>AuraHome</h1>
                <p>Breathe Life Into Your Space — Elegant Furniture, Effortlessly Yours.</p>
                <Link className="btn btn-primary" to={"/products"}>Shop the Collection</Link>
            </Col>
        </Row>
    )
}