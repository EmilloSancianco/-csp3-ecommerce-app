import { useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import OrderTable from '../components/OrderTable';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsMap, setProductsMap] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');

        const response = await fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/orders/my-orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Failed to fetch orders, status: ${response.status}`);
        }

        const data = await response.json();
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setError('No orders found.');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        const productIds = new Set();
        orders.forEach(order => {
          order.productsOrdered.forEach(product => {
            productIds.add(product.productId);
          });
        });

        const productNames = {};
        for (let productId of productIds) {
          const productResponse = await fetch(`https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/products/${productId}`);
          if (productResponse.ok) {
            const productData = await productResponse.json();
            productNames[productId] = productData.name || 'Unknown Product';
          } else {
            productNames[productId] = 'Unknown Product';
          }
        }

        setProductsMap(productNames);
      } catch (err) {
        console.error('Error fetching product names:', err);
      }
    };

    if (orders.length > 0) {
      fetchProductNames();
    }
  }, [orders]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="my-4">Order History</h1>
      {error && <Alert variant="danger"><strong>Error: </strong>{error}</Alert>}
      {orders.length === 0 ? (
        <Alert variant="info">You have no orders.</Alert>
      ) : (
        <OrderTable orders={orders} productsMap={productsMap} />
      )}
    </Container>
  );
};

export default Orders;
