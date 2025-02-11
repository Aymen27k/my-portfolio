import React from "react";
import "./index.css";

export default function About() {
  return (
    <div className="about">
      <h1>About Page</h1>
      <section id="about">
        {" "}
        <h2>About Me</h2> <p>Write a brief introduction about yourself here.</p>{" "}
      </section>
      <section id="projects">
        {" "}
        <h2>Projects</h2> <p>Showcase your projects here.</p>{" "}
      </section>
    </div>
  );
}
