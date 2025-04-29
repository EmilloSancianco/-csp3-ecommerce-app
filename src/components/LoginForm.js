import { Form, Button } from 'react-bootstrap';

export default function LoginForm({ email, setEmail, password, setPassword, isActive, onSubmit }) {
    return (
        <Form onSubmit={onSubmit}>
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