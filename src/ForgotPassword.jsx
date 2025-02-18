import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [showAlert, setShowAlert] = useState(false);
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users/forgot-password", { email });
      setShowAlert(true);
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        alert(
          error.response.data.message ||
            "An error occurred. Please try again later."
        );
      } else if (error.request) {
        // The request was made but no response was received
        alert("No response received from the server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        alert("An error occurred. Please try again later.");
      }
    }
  };
  return (
    <div className="signup template d-flex justify-content-center align-items-center">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3>Password Reset</h3>
          {showAlert && (
            <div className="alert alert-success" role="alert">
              <h5 className="alert-heading">Password Reset</h5>
              <p>Mail sent Successfully</p>
            </div>
          )}
          <div className="mb-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter Your Email"
              className="form-control"
            />
          </div>
          <div className="d-grid">
            <button className="btn btn-primary">Confirm</button>
          </div>
          <p className="form-links mt-2">
            Go back
            <Link to="/TodoList" className="ms-2">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
