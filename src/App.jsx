import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import ChangePassword from "./ChangePassword.jsx";
import ISSLocation from "./IssLocation.jsx";
import ResetPassword from "./ResetPassword.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("accessToken") ? true : false
  );

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<Home />} />
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
          <Route path="/ResetPassword/:token" element={<ResetPassword />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/ISSLocation" element={<ISSLocation />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
