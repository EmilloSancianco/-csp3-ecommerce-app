import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import OrdersModal from '../components/OrdersModal';
import ProductsTable from '../components/ProductsTable';
import UsersModal from '../components/UsersModal'; // Import the new UsersModal

const notyf = new Notyf({ duration: 2000, position: { x: 'right', y: 'bottom' } });

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false); // State for UsersModal
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
  const [users, setUsers] = useState([]); // State for users

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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
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
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/products`, {
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
      const { name, description, price } = selectedProduct;
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${selectedProduct._id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, description, price }),
      });
      if (selectedProduct.image) {
        saveLocalImageOverride(selectedProduct._id, selectedProduct.image);
      } else {
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
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${product._id}/${endpoint}`, {
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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`, {
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
        const orderIdParts = order._id ? order._id.split('/') : [];
        const extractedDate = orderIdParts.length > 1 ? orderIdParts.slice(1).join('/') : null;
        const orderedOn = order.orderedOn || extractedDate;

        const updatedProducts = order.productsOrdered.map((product) => {
          const productDetails = products.find((p) => p._id === product.productId);
          return {
            ...product,
            name: productDetails ? productDetails.name : 'Unknown Product',
          };
        });
        return {
          ...order,
          orderedOn: orderedOn,
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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/${orderId}/accept`, {
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
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/${orderId}`, {
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

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/all-users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      setUsers(data.users || []); // Assuming the API returns { users: [...] }
      setShowUsersModal(true);
    } catch (error) {
      console.error('Error fetching users:', error);
      triggerError(error.message || 'Failed to fetch users!');
    }
  };

  // Set a user as admin
  const setAsAdmin = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}/set-as-admin`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to set user as admin');
      }
      fetchUsers(); // Refresh the users list
      triggerSuccess('User set as admin successfully!');
    } catch (error) {
      console.error('Error setting user as admin:', error);
      triggerError(error.message || 'Failed to set user as admin!');
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h1 className="text-center mb-4">Admin Dashboard</h1>

      <div className="d-flex justify-content-center mb-4">
        <Button variant="primary" className="me-2" onClick={() => setShowAddModal(true)}>
          Add New Product
        </Button>
        <Button variant="secondary" className="me-2" onClick={fetchOrders}>
          Show User Orders
        </Button>
        <Button variant="info" onClick={fetchUsers}>
          Show All Users
        </Button>
      </div>

      <div className="scrollable-table-wrapper">
        <ProductsTable
          products={products}
          setSelectedProduct={setSelectedProduct}
          setShowEditModal={setShowEditModal}
          toggleAvailability={toggleAvailability}
        />
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        handleAddProduct={handleAddProduct}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        handleEditProduct={handleEditProduct}
      />

      {/* Orders Modal */}
      <OrdersModal
        show={showOrdersModal}
        onHide={() => setShowOrdersModal(false)}
        orders={orders}
        updateOrderStatus={updateOrderStatus}
        removeOrder={removeOrder}
      />

      {/* Users Modal */}
      <UsersModal
        show={showUsersModal}
        onHide={() => setShowUsersModal(false)}
        users={users}
        setAsAdmin={setAsAdmin}
      />
    </div>
  );
};

export default AdminDashboard;