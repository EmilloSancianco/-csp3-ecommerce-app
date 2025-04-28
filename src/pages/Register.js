import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Register() {

	const {user} = useContext(UserContext);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState(""); // Corrected useState typo

	const [isActive, setIsActive] = useState(false);

	console.log(email);
	console.log(password);
	console.log(confirmPassword);

	function registerUser(e) {

		// Prevents page redirection via form submission
		e.preventDefault();

		fetch('https://monhod8wi7.execute-api.us-west-2.amazonaws.com/production/register',{

            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                email: email,  // Corrected to use email directly
                password: password  // Corrected to use password directly

            })

		})
		.then(res => res.json())
		.then(data => {

			if(data.message === "Registered Successfully"){

				setEmail('');
				setPassword('');
				setConfirmPassword('');

				Swal.fire({
            	    title: "Registration Successful",
            	    icon: "success",
            	    text: "Thank you for registering!"
            	});

			} else {
				
				Swal.fire({
            	    title: "Something went wrong.",
            	    icon: "error",
            	    text: "Please try again later or contact us for assistance"
            	});

			}

		})
	}
    

	useEffect(() => {

		if((email !== "" && password !== "" && confirmPassword !== "") && (password === confirmPassword)){

			setIsActive(true);

		} else {

			setIsActive(false);

		}

	}, [email, password, confirmPassword]);  // Corrected dependency array to use email, password, and confirmPassword

	return (

		(user && user.id !== null) ?  // Added user null check to prevent errors if user is not available
		    <Navigate to="/courses" />
		:
			
			<Form onSubmit={(e) => registerUser(e)}>
				<h1 className="my-5 text-center">Register</h1>

				<Form.Group>
					<Form.Label>Email:</Form.Label>
					<Form.Control 
						type="email"
						placeholder="Enter Email" 
						required 
						value={email} 
						onChange={e => setEmail(e.target.value)} />
				</Form.Group>

				<Form.Group>
					<Form.Label>Password:</Form.Label>
					<Form.Control 
						type="password" 
						placeholder="Enter Password" 
						required 
						value={password} 
						onChange={e => setPassword(e.target.value)} /> {/* Corrected onChange */}
				</Form.Group>

				<Form.Group>
					<Form.Label>Confirm Password:</Form.Label>
					<Form.Control 
						type="password" 
						placeholder="Confirm Password" 
						required 
						value={confirmPassword} 
						onChange={e => setConfirmPassword(e.target.value)} /> {/* Corrected onChange */}
				</Form.Group>

				{
					isActive
					? <Button variant="primary" type="submit">Submit</Button>
					: <Button variant="primary" disabled>Submit</Button>
				}
			</Form>
		
	)
}
