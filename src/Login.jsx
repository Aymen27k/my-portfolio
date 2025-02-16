import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [rememberme, setRememeberme] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const response = await fetch("/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText || "login failed");
      }
      const data = await response.json();
      localStorage.setItem("userId", data.User._id);
      localStorage.setItem("username", data.User.username);
      localStorage.setItem("accessToken", data.accessToken);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error", error);
      setLoginError(error.message);
    }
  };

  return (
    <div className="login template d-flex justify-content-center align-items-center">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3>Sign in</h3>
          {loginError && <div className="error-message">{loginError}</div>}
          <div className="mb-2">
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="email"
              type="email"
              placeholder="Enter Your Email"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
