import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function RegisterForm({
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    mobileNo,
    setMobileNo,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isActive,
    onSubmit
}) {
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const newErrors = {};

        if (!firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!lastName.trim()) newErrors.lastName = 'Last name is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format.';
        if (!/^09\d{9}$/.test(mobileNo)) newErrors.mobileNo = 'Must be 11 digits starting with 09.';
        if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
        if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match.';

        setErrors(newErrors);
    }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

    return (
        <Form onSubmit={onSubmit}>
            <h1 className="my-5 text-center">Register</h1>

            <Form.Group>
                <Form.Label>First Name:</Form.Label>
                <Form.Control
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    isInvalid={!!errors.firstName}
                />
                {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
            </Form.Group>

            <Form.Group>
                <Form.Label>Last Name:</Form.Label>
                <Form.Control
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    isInvalid={!!errors.lastName}
                />
                {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
            </Form.Group>

            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    isInvalid={!!errors.email}
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
            </Form.Group>

            <Form.Group>
                <Form.Label>Mobile Number:</Form.Label>
                <Form.Control
                    type="text"
                    value={mobileNo}
                    onChange={e => setMobileNo(e.target.value)}
                    isInvalid={!!errors.mobileNo}
                />
                {errors.mobileNo && <small className="text-danger">{errors.mobileNo}</small>}
            </Form.Group>

            <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    isInvalid={!!errors.password}
                />
                {errors.password && <small className="text-danger">{errors.password}</small>}
            </Form.Group>

            <Form.Group>
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    isInvalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
            </Form.Group>

            <Button
                variant="primary"
                type="submit"
                className="mt-3"
                disabled={!isActive}
            >
                Submit
            </Button>
        </Form>
    );
}
