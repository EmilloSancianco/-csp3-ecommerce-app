import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({ duration: 2000, position: { x: 'right', y: 'bottom' } });

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    _id: '',
    name: '',
    description: '',
    price: '',
    image: '',
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });
  const [orders, setOrders] = useState([]);

  // Load local image overrides from localStorage
  const getLocalImageOverrides = () => {
    const overrides = localStorage.getItem('imageOverrides');
    return overrides ? JSON.parse(overrides) : {};
  };

  // Save image override to localStorage
  const saveLocalImageOverride = (productId, imageUrl) => {
    const overrides = getLocalImageOverrides();
    overrides[productId] = imageUrl;
    localStorage.setItem('imageOverrides', JSON.stringify(overrides));
  };

  // Remove image override from localStorage
  const removeLocalImageOverride = (productId) => {
    const overrides = getLocalImageOverrides();
    delete overrides[productId];
    localStorage.setItem('imageOverrides', JSON.stringify(overrides));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const triggerSuccess = (message) => {
    notyf.success(message);
  };

  const triggerError = (message) => {
    notyf.error(message);
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/products/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      // Apply local image overrides to fetched products
      const overrides = getLocalImageOverrides();
      const updatedProducts = data.map((product) => ({
        ...product,
        image: overrides[product._id] || product.image,
      }));
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      triggerError('Failed to fetch products!');
    }
  };

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newProduct),
      });
      setShowAddModal(false);
      setNewProduct({ name: '', description: '', price: '', image: '' });
      fetchProducts();
      triggerSuccess('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      triggerError('Failed to add product!');
    }
  };

  const handleEditProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      // Only send name, description, and price to the backend
      const { name, description, price } = selectedProduct;
      await fetch(`https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/products/${selectedProduct._id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, description, price }),
      });
      // Handle image override
      if (selectedProduct.image) {
        // Save image override if image URL is provided
        saveLocalImageOverride(selectedProduct._id, selectedProduct.image);
      } else {
        // Remove image override if image URL is empty
        removeLocalImageOverride(selectedProduct._id);
      }
      setShowEditModal(false);
      fetchProducts();
      triggerSuccess('Product updated successfully!');
    } catch (error) {
      console.error('Error editing product:', error);
      triggerError('Failed to update product!');
    }
  };

  const toggleAvailability = async (product) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = product.isActive ? 'archive' : 'activate';
      await fetch(`https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/products/${product._id}/${endpoint}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
      triggerSuccess(product.isActive ? 'Product disabled successfully!' : 'Product activated successfully!');
    } catch (error) {
      console.error('Error toggling availability:', error);
      triggerError('Failed to update availability!');
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/orders/all-orders', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }
      const updatedOrders = data.orders.map((order) => {
        const updatedProducts = order.productsOrdered.map((product) => {
          const productDetails = products.find((p) => p._id === product.productId);
          return {
            ...product,
            name: productDetails ? productDetails.name : 'Unknown Product',
          };
        });
        return {
          ...order,
          productsOrdered: updatedProducts,
        };
      });
      setOrders(updatedOrders);
      setShowOrdersModal(true);
    } catch (error) {
      console.error('Error fetching orders:', error);
      triggerError(error.message || 'Failed to fetch orders!');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/orders/${orderId}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        triggerError('Failed to update order status!');
        return;
      }
      fetchOrders();
      triggerSuccess(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      triggerError('Failed to update order status!');
    }
  };

  const removeOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
      triggerSuccess('Order removed successfully!');
    } catch (error) {
      console.error('Error removing order:', error);
      triggerError('Failed to remove order!');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Dashboard</h1>

      <div className="d-flex justify-content-center mb-4">
        <Button variant="primary" className="me-2" onClick={() => setShowAddModal(true)}>
          Add New Product
        </Button>
        <Button variant="secondary" onClick={fetchOrders}>
          Show User Orders
        </Button>
      </div>

      {/* Products Table */}
      <table className="table table-striped text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>₱{product.price}</td>
                <td>{product.isActive ? 'Available' : 'Unavailable'}</td>
                <td className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant={product.isActive ? 'danger' : 'success'}
                    size="sm"
                    onClick={() => toggleAvailability(product)}
                  >
                    {product.isActive ? 'Disable' : 'Activate'}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No products available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL here"
                value={newProduct.image || ''}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={selectedProduct?.name || ''}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={selectedProduct?.description || ''}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={selectedProduct?.price || ''}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL here"
                value={selectedProduct?.image || ''}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, image: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditProduct}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Orders Modal */}
      <Modal show={showOrdersModal} onHide={() => setShowOrdersModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>All Orders</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table table-striped text-center">
            <thead className="table-dark">
              <tr>
                <th>User ID</th>
                <th>Products</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.userId}</td>
                    <td>
                      <ul className="list-unstyled">
                        {order.productsOrdered && order.productsOrdered.length > 0 ? (
                          order.productsOrdered.map((product, index) => (
                            <li key={index}>
                              {product.name} x{product.quantity}
                            </li>
                          ))
                        ) : (
                          <li>No products</li>
                        )}
                      </ul>
                    </td>
                    <td>₱{order.totalPrice}</td>
                    <td>{order.status}</td>
                    <td>
                      {order.status === 'Pending' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => updateOrderStatus(order._id, 'Processed')}
                          className="me-2"
                        >
                          Mark as Processed
                        </Button>
                      )}
                      {order.status === 'Processed' && (
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => updateOrderStatus(order._id, 'Completed')}
                          className="me-2"
                        >
                          Mark as Completed
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeOrder(order._id)}
                      >
                        Remove Order
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No orders available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrdersModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;