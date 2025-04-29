import { Form, Button } from 'react-bootstrap';

export default function RegisterForm({ firstName, setFirstName, lastName, setLastName, email, setEmail, mobileNo, setMobileNo, password, setPassword, isActive, onSubmit }) {
    return (
        <Form onSubmit={onSubmit}>
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