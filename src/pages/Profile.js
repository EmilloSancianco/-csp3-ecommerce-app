import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Button, Alert, Modal, Form, Image
} from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Loading from '../components/Loading';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNo: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [preview, setPreview] = useState('');
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Initialize Notyf
  const [notyf] = useState(() =>
    new Notyf({
      duration: 3000,
      position: { x: 'right', y: 'top' },
      dismissible: true
    })
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in.');

        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) throw new Error('Failed to fetch profile');

        const data = await res.json();
        if (!data.user) throw new Error('Invalid user data received.');

        setUser(data.user);
        setFormData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          mobileNo: data.user.mobileNo || '',
          newPassword: '',
          confirmPassword: ''
        });
        setPreview(localStorage.getItem('profilePicture') || '');
      } catch (err) {
        setError(err.message);
        notyf.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [notyf]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('profilePicture', reader.result);
        setPreview(reader.result);
        notyf.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Check password mismatch only when passwords are being updated
      if (newData.newPassword && newData.confirmPassword) {
        setPasswordMismatch(newData.newPassword !== newData.confirmPassword);
      }
      return newData;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);

    if (passwordMismatch) {
      setSaveError('New password and confirmation do not match.');
      notyf.error('New password and confirmation do not match.');
      setSaving(false);
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const profileRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          mobileNo: formData.mobileNo
        })
      });

      if (!profileRes.ok) throw new Error('Failed to update profile');

      notyf.success('Profile updated successfully!');

      if (formData.newPassword.trim()) {
        const passRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/update-password`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ newPassword: formData.newPassword })
        });

        if (!passRes.ok) throw new Error('Failed to update password');

        notyf.success('Password updated successfully!');
      }

      const updatedUser = await profileRes.json();
      setUser(updatedUser);
      setShowModal(false);
    } catch (err) {
      setSaveError(err.message);
      notyf.error(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Fetching your profile..." />;
  if (error) return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;
  if (!user) return null;

  const profilePicture =
    localStorage.getItem('profilePicture') ||
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  return (
    <Container className="mt-5 pt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center shadow p-3">
            <Card.Body>
              <Image
                src={profilePicture}
                roundedCircle
                className="mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <Card.Title>
                {(user.firstName || '') + ' ' + (user.lastName || '') || 'Unnamed User'}
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {user.isAdmin ? 'Admin' : 'User'}
              </Card.Subtitle>
              <Card.Text>{user.email || 'No email provided'}</Card.Text>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Edit Profile
              </Button>
            </Card.Body>
          </Card>

          <Card className="mt-4 shadow">
            <Card.Header>Details</Card.Header>
            <Card.Body>
              <Row>
                <Col sm={4}><strong>Mobile No:</strong></Col>
                <Col sm={8}>{user.mobileNo || 'Not provided'}</Col>
              </Row>
              <Row className="mt-2">
                <Col sm={4}><strong>Email:</strong></Col>
                <Col sm={8}>{user.email || 'Not provided'}</Col>
              </Row>
              <Row className="mt-2">
                <Col sm={4}><strong>User ID:</strong></Col>
                <Col sm={8}>{user._id || 'N/A'}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {saveError && <Alert variant="danger">{saveError}</Alert>}
          <div className="text-center mb-3">
            <Image
              src={preview || 'https://medicine.uky.edu/sites/default/files/styles/large/public/2022-04/Blank%20Profile%20Picture.jpg.webp?itok=Oj_mMTEL'}
              roundedCircle
              style={{ width: 100, height: 100 }}
            />
            <Form.Group className="mt-2">
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Group>
          </div>
          <Form>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column sm={4}>First Name</Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column sm={4}>Last Name</Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column sm={4}>Mobile No</Form.Label>
              <Col sm={8}>
                <Form.Control
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column sm={4}>New Password</Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={4}>Confirm Password</Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={passwordMismatch}
                />
                {passwordMismatch && (
                  <Form.Control.Feedback type="invalid">
                    New password and confirmation do not match.
                  </Form.Control.Feedback>
                )}
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
