import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductsCard';

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/products/active')  // Replace with your actual API endpoint
            .then(res => res.json())
            .then(data => {
                console.log(data); // Log the response to check the structure
                setProducts(data);
            })
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    return (
        <div className="mt-5">
            <h1 className="text-center mb-4">Products</h1>
            <Row className="justify-content-center">
                {products.map(product => (
                    <Col key={product._id} xs={12} md={6} lg={4}>
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
        </div>
    );
}
