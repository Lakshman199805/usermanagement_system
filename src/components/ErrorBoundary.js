import React, { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, errorMessage: "" };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error) {
    this.setState({ errorMessage: error.message });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger">
          Something went wrong: {this.state.errorMessage}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
