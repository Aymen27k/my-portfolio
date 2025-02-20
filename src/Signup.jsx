import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoadingContext } from "./LoadingContext.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const { isLoading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError(null);

    if (!username || !email || !password) {
      setSignupError("Please enter all fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/users/signup", {
        username,
        email,
        password,
      });

      setShowAlert(true);
      setTimeout(() => {
        navigate("/TodoList");
      }, 2500);

      const data = response.data; // Access data with response.data
      onSignup(data); // Call the onSignup callback
    } catch (error) {
      console.error("Signup error:", error);

      if (error.response) {
        // Check if the server returned an error response
        const errorMessage = error.response.data.message || "Signup failed";
        setSignupError(errorMessage);
      } else if (error.request) {
        // Check if a request was made but no response was received
        setSignupError("No response from the server.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="signup template d-flex justify-content-center align-items-center">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
          {isLoading && <LoadingSpinner />}
          {signupError && <div className="error-message">{signupError}</div>}
          {showAlert && (
            <div className="alert alert-success" role="alert">
              <h4 className="alert-heading">Welcome!</h4>
              <p>Your account has been created.</p>
            </div>
          )}
          <div className="mb-2">
            <label htmlFor="uname">User Name</label>
            <input
              type="text"
              id="uname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter Your UserName"
              className="form-control"
            />
          </div>
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
          <div className="d-grid">
            <button className="btn btn-primary">Sign Up</button>
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
Signup.propTypes = {
  onSignup: PropTypes.func,
};
export default Signup;
