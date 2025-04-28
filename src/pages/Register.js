import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Register() {

    const { user } = useContext(UserContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");

    const [isActive, setIsActive] = useState(false);

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
                    text: "Thank you for registering!"
                });
            } else {
                Swal.fire({
                    title: "Something went wrong",
                    icon: "error",
                    text: data.error || "Please try again later or contact support."
                });
            }
        })
        .catch(err => {
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

    return (
        (user && user.id !== null) 
        ? <Navigate to="/courses" /> 
        : 
        <Form onSubmit={registerUser}>
            <h1 className="my-5 text-center">Register</h1>

            <Form.Group>
                <Form.Label>First Name:</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Enter First Name" 
                    required
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)} 
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Last Name:</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Enter Last Name" 
                    required
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)} 
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control 
                    type="email" 
                    placeholder="Enter Email" 
                    required
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Mobile Number:</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="09XXXXXXXXX" 
                    required
                    value={mobileNo} 
                    onChange={e => setMobileNo(e.target.value)} 
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Enter Password (min 8 chars)" 
                    required
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                />
            </Form.Group>

            {
                isActive
                ? <Button variant="primary" type="submit" className="mt-3">Submit</Button>
                : <Button variant="primary" disabled className="mt-3">Submit</Button>
            }
        </Form>
    );
}
