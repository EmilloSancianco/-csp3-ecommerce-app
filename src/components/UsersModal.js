import React from 'react';
import { Modal, Button } from 'react-bootstrap';


const UsersModal = ({ show, onHide, users, setAsAdmin }) => {
  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>All Users</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive">
          <table className="table table-striped text-center">
            <thead className="table-dark">
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Is Admin</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                    <td>
                      {!user.isAdmin && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="py-1 px-2"
                          onClick={() => setAsAdmin(user._id)}
                        >
                          <span className="d-none d-sm-inline">Set as Admin</span>
                          <span className="d-inline d-sm-none">Admin</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No users available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UsersModal;
