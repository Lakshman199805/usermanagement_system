import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";

const UserForm = ({ selectedUser, onClose, onSave }) => {
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (selectedUser) {
      const [firstName, ...lastName] = selectedUser.name.split(" ");
      setUser({
        id: selectedUser.id,
        firstName,
        lastName: lastName.join(" "),
        email: selectedUser.email,
        department: selectedUser.company.name,
      });
    }
  }, [selectedUser]);

  const validate = () => {
    const errors = {};
    if (!user.firstName) errors.firstName = "First name is required";
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email))
      errors.email = "Invalid email address";
    if (!user.department) errors.department = "Department is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      onSave({
        ...user,
        name: `${user.firstName} ${user.lastName}`,
        company:{name:user.department}
      });
      onClose();
    } catch {
      setErrorMessage("Failed to save user");
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedUser ? "Edit User" : "Add User"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              isInvalid={!!errors.firstName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.firstName}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formDepartment">
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              value={user.department}
              onChange={(e) => setUser({ ...user, department: e.target.value })}
              isInvalid={!!errors.department}
            />
            <Form.Control.Feedback type="invalid">
              {errors.department}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="text-center mt-3">
            <Button variant="primary" type="submit">
              {selectedUser ? "Save Changes" : "Add User"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserForm;
