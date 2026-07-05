import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav>
      <Link to="/">📚 Neighborhood Library</Link>
      <Link to="/books">Books</Link>
      <Link to="/members">Members</Link>
      <Link to="/borrow">Borrow / Return</Link>
    </nav>
  );
}