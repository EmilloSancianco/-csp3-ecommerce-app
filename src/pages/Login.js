import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [redirect, setRedirect] = useState(false);

    function authenticate(e) {
        e.preventDefault();

        fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json().then(data => ({ status: res.status, body: data })))
        .then(({ status, body }) => {
            if (status === 200 && body.access) {
                localStorage.setItem('token', body.access);
                retrieveUserDetails(body.access);

                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: "Welcome back!"
                });

                setRedirect(true);
            } else {
                // Handle specific error messages
                let errorMsg = "Authentication failed. Please try again.";
                if (body.error) {
                    errorMsg = body.error;
                }

                Swal.fire({
                    title: "Login Failed",
                    icon: "error",
                    text: errorMsg
                });
            }
        })
        .catch(err => {
            console.error("Error during login:", err);
            Swal.fire({
                title: "Server Error",
                icon: "error",
                text: "Something went wrong, please try again later."
            });
        });

        setEmail('');
        setPassword('');
    }

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
                    title: "User Not Found",
                    icon: "error",
                    text: "Failed to fetch user information."
                });
            }
        })
        .catch(err => {
            console.error("Error fetching user details:", err);
            Swal.fire({
                title: "Server Error",
                icon: "error",
                text: "Unable to retrieve user details."
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
        return <Navigate to="/" />;
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
                <Button variant="primary" type="submit" className="mt-3">
                    Submit
                </Button>
            ) : (
                <Button variant="secondary" type="submit" disabled className="mt-3">
                    Submit
                </Button>
            )}
        </Form>
    );
}
