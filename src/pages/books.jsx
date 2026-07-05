import { useEffect, useState } from "react";
import { listBooks, createBook, updateBook } from "../../lib/api";

const emptyForm = { title: "", author: "", isbn: "", genre: "", published_year: "", total_copies: 1 };

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await listBooks();
      setBooks(res.data.results ?? res.data);
    } catch (e) {
      setError("Could not load books. Is the backend running?");
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      published_year: form.published_year ? Number(form.published_year) : null,
      total_copies: Number(form.total_copies) || 1,
    };
    try {
      if (editingId) {
        await updateBook(editingId, payload);
      } else {
        await createBook(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (e) {
      setError(JSON.stringify(e.response?.data ?? e.message));
    }
  };

  const startEdit = (book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn ?? "",
      genre: book.genre ?? "",
      published_year: book.published_year ?? "",
      total_copies: book.total_copies,
    });
  };

  return (
    <div>
      <h1>Books</h1>

      <form className="inline-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
        <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} />
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
        <input name="published_year" placeholder="Year" type="number" value={form.published_year} onChange={handleChange} />
        <input name="total_copies" placeholder="Copies" type="number" min="1" value={form.total_copies} onChange={handleChange} />
        <button type="submit">{editingId ? "Update Book" : "Add Book"}</button>
        {editingId && (
          <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Title</th><th>Author</th><th>Genre</th><th>Year</th>
            <th>Available / Total</th><th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.genre}</td>
              <td>{b.published_year}</td>
              <td>{b.available_copies} / {b.total_copies}</td>
              <td><button onClick={() => startEdit(b)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
