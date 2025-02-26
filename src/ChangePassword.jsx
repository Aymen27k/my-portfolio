import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoadingContext } from "./LoadingContext.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [erroMessage, setErroMessage] = useState(null);
  const { isLoading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroMessage(null);
  };
  return (
    <div className="signup template d-flex justify-content-center align-items-center">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3>Change password</h3>
          {isLoading && <LoadingSpinner />}
          {erroMessage && <div className="error-message">{erroMessage}</div>}
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
            Already registerd ?
            <Link to="/TodoList" className="ms-2">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
