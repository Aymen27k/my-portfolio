import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header href="/" className="header">
      <a href="/" className="logo">
        Logo
      </a>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/ISSLocation">ISS</Link>
        <Link to="/books">Books</Link>
        <Link to="/TodoList">To-do List</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Navbar;
