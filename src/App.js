import React, { Component } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import Pagination from "./components/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

class App extends Component {
  state = {
    users: [],
    selectedUser: null,
    showForm: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    loading: false,
  };

  usersPerPage = 5;
  BASE_URL = "https://jsonplaceholder.typicode.com/users";

  componentDidMount() {
    this.loadUsers(this.state.currentPage);
  }

  loadUsers = async (page) => {
    this.setState({ loading: true, error: null });
    try {
      const response = await axios.get(this.BASE_URL, {
        params: { _page: page, _limit: this.usersPerPage },
      });
      const totalUsers = parseInt(response.headers["x-total-count"], 10) || 10;
      this.setState({
        users: response.data,
        totalPages: Math.ceil(totalUsers / this.usersPerPage),
        loading: false,
      });
    } catch (error) {
      this.setState({ error: "Failed to load users", loading: false });
      toast.error("Failed to load users");
    }
  };

  handleAddUser = () => {
    this.setState({ selectedUser: null, showForm: true });
  };

  // handleSaveUser = async (user) => {
  //   try {
  //     let newUser;
  //     if (user.id) {
  //       // Editing existing user
  //       const response = await axios.put(`${this.BASE_URL}/${user.id}`, user);
  //       const updatedUsers = this.state.users.map((u) =>
  //         u.id === user.id ? { ...u, ...response.data } : u
  //       );
  //       this.setState({ users: updatedUsers, showForm: false });
  //       toast.success("User updated successfully!");
  //     } else {
  //       // Adding a new user
  //       const response = await axios.post(this.BASE_URL, user);
  
  //       // Generate a unique ID for the new user (e.g., using Date.now or the response from the server)
  //       const newUser = {
  //         id: Date.now(),
  //         name: user.name,
  //         email: user.email,
  //         company: { name: user.department || "N/A" },
  //         ...response.data,
  //       };
  
  //       // Add the new user to the users array
  //       this.setState((prevState) => {
  //         const updatedUsers = [...prevState.users, newUser]; // Append new user
  //         const totalUsers = updatedUsers.length; // Total number of users after addition
  //         const lastPage = Math.ceil(totalUsers / this.usersPerPage); // Last page based on updated user count
          
  //         // Adjust currentPage if necessary
  //         return {
  //           users: updatedUsers,
  //           showForm: false,
  //           currentPage: lastPage, // Set currentPage to last page
  //         };
  //       });
  
  //       toast.success("User added successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error in handleSaveUser:", error.message);
  //     this.setState({ error: "Failed to save user" });
  //     toast.error("Failed to save user");
  //   }
  // };
  
  handleSaveUser = async (user) => {
    try {
      let newUser;
      if (user.id) {
        // Editing existing user
        const response = await axios.put(`${this.BASE_URL}/${user.id}`, user);
        const updatedUsers = this.state.users.map((u) =>
          u.id === user.id ? { ...u, ...response.data } : u
        );
        this.setState({ users: updatedUsers, showForm: false });
        toast.success("User updated successfully!");
      } else {
        // Adding a new user
        const response = await axios.post(this.BASE_URL, user);
  
        // Generate a unique ID for the new user (e.g., using Date.now or the response from the server)
        const newUser = {
          id: Date.now(),
          name: user.name,
          email: user.email,
          company: { name: user.department || "N/A" },
          ...response.data,
        };
  
        // Determine the last page by checking the total number of users
        const totalUsers = this.state.users.length + 1; // Include the new user
        const lastPage = Math.ceil(totalUsers / this.usersPerPage);
  
        // Add the new user to the users array
        this.setState((prevState) => ({
          users: [...prevState.users, newUser],  // Append the new user at the end
          showForm: false,
          currentPage: lastPage, // Move to the last page
        }), () => {
          // After updating the state, load the users for the last page
          this.loadUsers(lastPage);
        });
  
        toast.success("User added successfully!");
      }
    } catch (error) {
      console.error("Error in handleSaveUser:", error.message);
      this.setState({ error: "Failed to save user" });
      toast.error("Failed to save user");
    }
  };
  
 
  handleEditUser = (user) => {
    this.setState({ selectedUser: user, showForm: true });
  };

  handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${this.BASE_URL}/${id}`);
      const filteredUsers = this.state.users.filter((user) => user.id !== id);
      this.setState({ users: filteredUsers });
      toast.success("User deleted successfully!");
    } catch (error) {
      this.setState({ error: "Failed to delete user" });
      toast.error("Failed to delete user");
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page }, () => {
      this.loadUsers(page);
    });
  };

  render() {
    const {
      users,
      selectedUser,
      showForm,
      error,
      currentPage,
      totalPages,
      loading,
    } = this.state;

    return (
      <Container>
        <ToastContainer position="top-right" autoClose={3000} />
        <h1 className="my-4 text-center">User Management</h1>
        {error && <Alert variant="danger">{error}</Alert>}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <Button variant="primary" onClick={this.handleAddUser}>
            Add User
          </Button>
        </div>

        <UserList
          users={users}
          onEdit={this.handleEditUser}
          onDelete={this.handleDeleteUser}
          loading={loading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={this.handlePageChange}
        />

        {showForm && (
          <UserForm
            selectedUser={selectedUser}
            onClose={() => this.setState({ showForm: false })}
            onSave={this.handleSaveUser}
          />
        )}
      </Container>
    );
  }
}

export default App;
