import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import NotFoundPage from "./NotFoundPage.jsx";
import Contact from "./contact.jsx";
import About from "./about.jsx";
import Home from "./Home.jsx";
import Books from "./books.jsx";
import TodoList from "./TodoList.jsx";
import Signup from "./Signup.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import Login from "./Login.jsx";
import ISSLocation from "./IssLocation.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import api from "./apiClient.js";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("accessToken") ? true : false
  );

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} errorElement={<NotFoundPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/books/" element={<Books />} />
          <Route
            path="/todolist"
            element={
              isLoggedIn ? (
                <TodoList setIsLoggedIn={setIsLoggedIn} />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/ISSLocation" element={<ISSLocation />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
