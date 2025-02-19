import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import "./index.css";
import App from "./App.jsx";
import { LoadingProvider } from "./LoadingContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </StrictMode>
);
