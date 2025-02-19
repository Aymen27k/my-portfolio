// LoadingSpinner.js
import { useContext } from "react";
import { LoadingContext } from "./LoadingContext.jsx";
import "./LoadingSpinner.css";

const LoadingSpinner = () => {
  const { isLoading } = useContext(LoadingContext);
  return isLoading ? (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  ) : null;
};
export default LoadingSpinner;
