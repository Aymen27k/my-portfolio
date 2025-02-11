import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError(null);

    if (!username || !email || !password) {
      setSignupError("Please enter all fields.");
      return;
    }

    try {
      const response = await fetch("/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }
      setShowAlert(true);
      setTimeout(() => {
        navigate("/TodoList");
      }, 2500);
      const data = await response.json();
      onSignup(data); // Call the onSignup callback, passing the data if needed
    } catch (error) {
      console.error("Signup error:", error);
      setSignupError(error.message);
    }
  };
  return (
    <div className="signup template d-flex justify-content-center align-items-center">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
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
              placeholder="Enter Your Name"
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
