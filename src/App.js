import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Error from './pages/Error';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';


import './App.css';
import { UserProvider } from './UserContext'; // Import UserProvider

function App() {
    const [user, setUser] = useState({ id: null });

    const unsetUser = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setUser({ id: null }); // Reset user state
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/users/details', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.user) {
                        setUser({
                            id: data.user._id,
                            isAdmin: data.user.isAdmin,
                        });
                    } else {
                        setUser({ id: null }); // If no user found, reset user state
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user details:', error);
                    setUser({ id: null }); // Reset user state if fetch fails
                });
        }
    }, []); // Empty dependency array means this runs only on mount

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <Router>
                <AppNavbar />
                <Container>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<Logout unsetUser={unsetUser} />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/cart" element= {<Cart />} />
                        <Route path="*" element={<Error />} />
                    </Routes>
                </Container>
            </Router>
        </UserProvider>
    );
}

export default App;
