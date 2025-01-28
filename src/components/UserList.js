import React from "react";
import { Table, Button, Spinner } from "react-bootstrap";

const UserList = ({ users, onEdit, onDelete, loading }) => {
  return (
    <div>
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.company?.name || ""}</td>
                <td>
                  <Button variant="warning" onClick={() => onEdit(user)}>
                    Edit
                  </Button>&nbsp;&nbsp;
                  <Button variant="danger" onClick={() => onDelete(user.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserList;
