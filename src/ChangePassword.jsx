import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./apiClient.js";
import { LoadingContext } from "./LoadingContext.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { isLoading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Please enter all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      const response = await api.post(
        "/users/password",
        { userId, oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowAlert(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/TodoList");
      }, 2500);
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        setErrorMessage(error.response.data.message);
      } else if (error.request) {
        // Request was made but no response was received
        setErrorMessage("Network error. Please check your connection.");
        console.error("Network error:", error); // Log the original error
      } else if (error instanceof TypeError) {
        // Handle TypeError (e.g., syntax error)
        setErrorMessage("A technical error occurred.");
        console.error("TypeError:", error);
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrorMessage("An unexpected error occurred.");
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="signup template d-flex justify-content-center align-items-center">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3>Change password</h3>
          {isLoading && <LoadingSpinner />}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {showAlert && (
            <div className="alert alert-success" role="alert">
              <h4 className="alert-heading">Done !</h4>
              <p>Your Password has been Changed.</p>
            </div>
          )}
          <div className="mb-2">
            <label htmlFor="password">Old Password</label>
            <input
              type="password"
              id="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value.trim())}
              required
              placeholder="Enter Your Existing Password"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value.trim())}
              required
              placeholder="Enter Your New Password"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password">Confirm new Password</label>
            <input
              type="password"
              id="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value.trim())}
              required
              placeholder="Confirm new Password"
              className="form-control"
            />
          </div>
          <div className="d-grid">
            <button className="btn btn-primary">Confirm</button>
          </div>
          <p className="form-links mt-2">
            Go back ?
            <Link to="/TodoList" className="ms-2">
              To Do List
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
