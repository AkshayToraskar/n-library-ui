import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Borrow from "./pages/Borrow";

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path="/borrow" element={<Borrow />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}