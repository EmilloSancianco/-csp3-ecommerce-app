import { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap'; // Importing Bootstrap components
import UserContext from '../UserContext';
import RegisterForm from '../components/RegisterForm';
import Loading from '../components/Loading'; // Import Loading component

export default function Register() {
    const { user } = useContext(UserContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");

    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state
    const [redirect, setRedirect] = useState(false); // New redirect state

    function registerUser(e) {
        e.preventDefault();

        // === Client-side Validations ===
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^09\d{9}$/;

        if (!emailRegex.test(email)) {
            Swal.fire({
                title: "Invalid Email",
                icon: "error",
                text: "Please enter a valid email address."
            });
            return;
        }

        if (!mobileRegex.test(mobileNo)) {
            Swal.fire({
                title: "Invalid Mobile Number",
                icon: "error",
                text: "Mobile number must start with 09 and have 11 digits total."
            });
            return;
        }

        if (password.length < 8) {
            Swal.fire({
                title: "Weak Password",
                icon: "error",
                text: "Password must be at least 8 characters long."
            });
            return;
        }

        // === Proceed to send request if valid ===
        setLoading(true); // Set loading state to true when starting registration

        fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/users/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                mobileNo,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            setLoading(false); // Set loading to false once registration is completed

            if (data.message === "Registered Successfully") {
                // Reset all fields
                setFirstName('');
                setLastName('');
                setEmail('');
                setMobileNo('');
                setPassword('');

                Swal.fire({
                    title: "Registration Successful",
                    icon: "success",
                    text: "Your account has been registered successfully!"
                });

                // Redirect to login page after successful registration
                setRedirect(true);
            } else {
                Swal.fire({
                    title: "Something went wrong",
                    icon: "error",
                    text: data.error || "Please try again later or contact support."
                });
            }
        })
        .catch(err => {
            setLoading(false); // Set loading to false in case of error
            console.error(err);
            Swal.fire({
                title: "Server Error",
                icon: "error",
                text: "Unable to connect to the server. Please try again later."
            });
        });
    }

    useEffect(() => {
        if (
            firstName !== "" &&
            lastName !== "" &&
            email !== "" &&
            mobileNo !== "" &&
            password !== ""
        ) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [firstName, lastName, email, mobileNo, password]);

    if (redirect) {
        return <Navigate to="/login" />; // Redirect to login page after successful registration
    }

    return (
        (user && user.id !== null) 
        ? <Navigate to="/courses" /> 
        : <Container className="mt-5 pt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={6} lg={4}>
                    {loading ? (
                        <Loading message="Registering your account..." /> // Show loading screen
                    ) : (
                        <RegisterForm
                            firstName={firstName}
                            setFirstName={setFirstName}
                            lastName={lastName}
                            setLastName={setLastName}
                            email={email}
                            setEmail={setEmail}
                            mobileNo={mobileNo}
                            setMobileNo={setMobileNo}
                            password={password}
                            setPassword={setPassword}
                            isActive={isActive}
                            onSubmit={registerUser}
                        />
                    )}
                </Col>
            </Row>
        </Container>
    );
}
