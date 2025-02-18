import React, { userState, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setLoginError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/users/reset-password", {
        token,
        password,
      });

      setShowAlert(true);
      if (response.status === 200) {
        // Check status code for success
        setTimeout(() => {
          navigate("/TodoList");
        }, 2500);
      }
    } catch (error) {
      console.error("Error: ", error);
      if (error.response) {
        loginError("An error occurred !");
        console.error("Server error : ", error.response.data);
      } else if (error.request) {
        loginError("No response received from the server.");
        console.error("Request error : ", error.request);
      } else {
        loginError("An error occurred. Please try again later.");
        console.error("Setup Error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="signup template d-flex justify-content-center align-items-center">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3>Reset Password</h3>
          {loginError && <div className="error-message">{loginError}</div>}
          {showAlert && (
            <div className="alert alert-success" role="alert">
              <h4 className="alert-heading">Done !</h4>
              <p>Your password has been modified</p>
            </div>
          )}
          <div className="mb-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter Your Password"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm New Password"
              className="form-control"
            />
          </div>
          <div className="d-grid">
            <button className="btn btn-primary">Reset Password</button>
          </div>
          <p className="form-links mt-2">
            Back to Log in ?
            <Link to="/TodoList" className="ms-2">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
