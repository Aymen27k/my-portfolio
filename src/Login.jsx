import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { LoadingContext } from "./LoadingContext.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

function Login({ setIsLoggedIn }) {
  const [userLogin, setUserLogin] = useState("");
  const [password, setPassword] = useState("");
  //const [rememberme, setRememeberme] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const { isLoading, setLoading } = useContext(LoadingContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);
    try {
      const response = await axios.post("/users/login", {
        userLogin,
        password,
      });
      const data = response.data; // Access the data from response.data

      localStorage.setItem("userId", data.User._id);
      localStorage.setItem("username", data.User.username);
      localStorage.setItem("accessToken", data.accessToken);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error", error);

      if (error.response) {
        // Check if the error has a response (from the server)
        const errorMessage = error.response.data.message || "Login failed"; // Extract the error message
        setLoginError(errorMessage); // Set the error message for display
        console.error("Server Error Details:", error.response.data); // Log detailed server error for debugging
      } else if (error.request) {
        // The request was made but no response was received
        setLoginError("No response from the server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setLoginError("An error occurred while setting up the request.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login template d-flex justify-content-center align-items-center">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3>Sign in</h3>
          {isLoading && <LoadingSpinner />}
          {loginError && <div className="error-message">{loginError}</div>}
          <div className="mb-2">
            <label htmlFor="email">Email or Username</label>
            <input
              value={userLogin}
              onChange={(e) => setUserLogin(e.target.value.trim())}
              required
              id="email"
              type="text"
              placeholder="Enter Your Email or Username"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              required
              id="password"
              placeholder="Enter Your Password"
              className="form-control"
            />
          </div>
          {/* <div className="mb-2">
          <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememeberme(e.target.checked)}
              id="check"
              className="custom-control custom-checkbox"
            />
            <label htmlFor="check" className="custom-input-label ms-2">
              Remember me
            </label>
          </div>*/}
          <div className="d-grid mt-2">
            <button className="btn btn-primary">Sign in</button>
          </div>
          <p className="form-links mt-2">
            Forgot <Link to="/forgotPassword">Password?</Link>
            <Link to="/signup" className="ms-2">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
Login.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};
export default Login;
