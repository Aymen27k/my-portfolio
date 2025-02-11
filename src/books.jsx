import React from "react";
import { Link } from "react-router-dom";

export default function Books() {
  return (
    <div>
      <h1> Books</h1>
      <Link to="/books/1">Book 1</Link>
      <br></br>
      <Link to="/books/2">Book 2</Link>
    </div>
  );
}
