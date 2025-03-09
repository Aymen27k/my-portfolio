import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="notfound-container">
      <h1>404 Not Found</h1>
      <br></br>
      <Link to="/">Home</Link>
    </div>
  );
}
