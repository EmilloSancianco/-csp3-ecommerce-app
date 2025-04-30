// src/pages/Orders.js
import { useEffect, useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
import OrderTable from '../components/OrderTable';
import Loading from '../components/Loading';

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

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`, {
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
          const productResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`);
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
    return <Loading message="Loading your orders..." />; // Use the Loading component here
  }

  return (
    <Container>
      <h1 className="mt-5 pt-5">Order History</h1>
      {orders.length === 0 ? (
  <p className="text-muted">You have no orders.</p>
) : (
  <OrderTable orders={orders} productsMap={productsMap} />
)}

    </Container>
  );
};

export default Orders;
