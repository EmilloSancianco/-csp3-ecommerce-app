import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom'; // For redirect
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [redirect, setRedirect] = useState(false);

    // Authentication function
    function authenticate(e) {
        e.preventDefault();

        // Clear any previous alerts
        Swal.fire({
            showConfirmButton: false,
            title: 'Logging in...',
            timer: 1500,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.access) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);

                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: "Welcome to Zuitt!"
                });

                setRedirect(true); // Set redirect state after successful login
            } else {
                Swal.fire({
                    title: "Authentication failed",
                    icon: "error",
                    text: "Check your login details and try again."
                });
            }
        })
        .catch(err => {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Something went wrong, please try again later."
            });
            console.error("Error during login:", err);
        });

        setEmail('');
        setPassword('');
    }

    // Retrieve user details after successful login
    const retrieveUserDetails = (token) => {
        fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/users/details', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                setUser({
                    id: data.user._id,
                    isAdmin: data.user.isAdmin
                });
            } else {
                Swal.fire({
                    title: "User not found",
                    icon: "error",
                    text: "Could not retrieve user data. Please try again."
                });
            }
        })
        .catch(err => {
            console.error("Error retrieving user details:", err);
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Failed to fetch user details. Please try again."
            });
        });
    };

    useEffect(() => {
        if (email !== '' && password !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    if (redirect) {
        return <Navigate to="/games" />; // Redirect to the Games page after login
    }

    return (
        <Form onSubmit={authenticate}>
            <h1 className="my-5 text-center">Login</h1>
            <Form.Group controlId="userEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>

            {isActive ? (
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            ) : (
                <Button variant="danger" type="submit" disabled>
                    Submit
                </Button>
            )}
        </Form>
    );
}
