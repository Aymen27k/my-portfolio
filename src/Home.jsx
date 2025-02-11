import React from "react";
import "./index.css";

export default function Home() {
  return (
    <div>
      <section id="home" className="home">
        {" "}
        <h2>Home</h2> <p>Hi, I'm Aymen Kalaï Ezar. Welcome to my portfolio!</p>{" "}
      </section>
      <section id="contact" className="contact">
        {" "}
        <h2>Contact</h2>{" "}
        <form>
          <label htmlFor="name">Name:</label>{" "}
          <input type="text" id="name" name="name" />{" "}
          <label htmlFor="email">Email:</label>{" "}
          <input type="email" id="email" name="email" />{" "}
          <label htmlFor="message">Message:</label>{" "}
          <textarea id="message" name="message"></textarea>
          <button type="submit">Send</button>{" "}
        </form>{" "}
      </section>
      <footer className="footer">
        {" "}
        <p>&copy; 2024 My Portfolio</p>{" "}
      </footer>
    </div>
  );
}
