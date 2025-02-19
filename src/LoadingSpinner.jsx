// LoadingSpinner.js
import React, { useContext } from "react";
import { LoadingContext } from "./LoadingContext.jsx";
import "./LoadingSpinner.css";

const LoadingSpinner = () => {
  const { isLoading } = useContext(LoadingContext);
  return isLoading ? <div className="loading-spinner"></div> : null; // Or any other loading indicator
};
export default LoadingSpinner;
