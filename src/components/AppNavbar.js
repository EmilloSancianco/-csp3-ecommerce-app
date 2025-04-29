import { useContext } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../UserContext';

export default function AppNavbar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar expand="lg" className="navbar-center" fixed="top">
            <Container>
                {/* Brand on the left */}
                <Navbar.Brand as={Link} to="/" className="navbar-brand text-black">
                    AuraHome
                </Navbar.Brand>

                {/* Toggler icon on the right */}
                <Navbar.Toggle aria-controls="navbar-nav" className="ms-auto" />

                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto">
                        {!user.isAdmin && (
                            <Nav.Link as={NavLink} to="/" exact="true" className="nav-link">
                                Home
                            </Nav.Link>
                        )}
                        {user.id !== null ? (
                            <>
                                {user.isAdmin && (
                                    <Nav.Link as={Link} to="/admin" className="nav-link">
                                        Admin Dashboard
                                    </Nav.Link>
                                )}
                                {!user.isAdmin && (
                                    <>
                                        <Nav.Link as={NavLink} to="/products" exact="true" className="nav-link">
                                            Products
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/cart" className="nav-link">
                                            My Cart
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/orders" className="nav-link">
                                            My Orders
                                        </Nav.Link>
                                    </>
                                )}
                                <Nav.Link as={Link} to="/logout" className="nav-link">
                                    Logout
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="nav-link">
                                    Login
                                </Nav.Link>
                                <Nav.Link as={Link} to="/register" className="nav-link">
                                    Register
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
