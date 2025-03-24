import React, { useEffect, useState, useRef } from "react";
import "./Navbar.css";
import logoImage from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();

  const ToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    };
  }, [menuRef]);
  const closeMenuAndNavigate = () => {
    setIsMenuOpen(false);
  };
  return (
    <header href="/" className="header">
      <a href="/" className="logo">
        <img src={logoImage} alt="Logo" />
      </a>
      <div className="hamburger-menu-button" onClick={ToggleMenu}>
        <img src="menu_trans.png" alt="hamburger-menu"></img>
      </div>
      <nav className={`navbar ${isMenuOpen ? "nav-active" : ""}`} ref={menuRef}>
        <Link to="/" onClick={closeMenuAndNavigate}>
          Home
        </Link>
        <Link to="/ISSLocation" onClick={closeMenuAndNavigate}>
          ISS
        </Link>
        <Link to="/books" onClick={closeMenuAndNavigate}>
          Books
        </Link>
        <Link to="/TodoList" onClick={closeMenuAndNavigate}>
          YouDo-List
        </Link>
        <Link to="/about" onClick={closeMenuAndNavigate}>
          About
        </Link>
        <Link to="/contact" onClick={closeMenuAndNavigate}>
          Contact
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
