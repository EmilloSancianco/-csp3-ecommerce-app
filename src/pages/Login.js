import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import LoginForm from '../components/LoginForm';
import { Container, Row, Col } from 'react-bootstrap';
import Loading from '../components/Loading'; // Import the Loading component

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(false); // Manage loading state

    function authenticate(e) {
        e.preventDefault();
        
        setLoading(true); // Set loading to true when the request starts

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json().then(data => ({ status: res.status, body: data })))
        .then(({ status, body }) => {
            setLoading(false); // Set loading to false once the response is received

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
            setLoading(false); // Set loading to false on error
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
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
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
        <Container className="mt-5 pt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={6} lg={4}>
                    {loading ? ( // Show loading spinner with a custom message while loading is true
                        <Loading message="Logging In..." />
                    ) : (
                        <LoginForm
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            isActive={isActive}
                            onSubmit={authenticate}
                        />
                    )}
                </Col>
            </Row>
        </Container>
    );
}
