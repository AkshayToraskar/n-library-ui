import { useEffect, useState } from "react";
import { listBooks, listMembers, listBorrowRecords, borrowBook, returnBook } from "../../lib/api";

export default function BorrowPage() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  const loadAll = async () => {
    try {
      const [b, m, r] = await Promise.all([
        listBooks({ page_size: 100 }),
        listMembers({ page_size: 100 }),
        listBorrowRecords(statusFilter ? { status: statusFilter } : {}),
      ]);
      setBooks(b.data.results ?? b.data);
      setMembers(m.data.results ?? m.data);
      setRecords(r.data.results ?? r.data);
    } catch (e) {
      setError("Could not load data. Is the backend running?");
    }
  };

  useEffect(() => { loadAll(); }, [statusFilter]);

  const handleBorrow = async (e) => {
    e.preventDefault();
    setError("");
    if (!selectedBook || !selectedMember) return;
    try {
      await borrowBook(selectedBook, selectedMember);
      setSelectedBook("");
      setSelectedMember("");
      loadAll();
    } catch (e) {
      setError(JSON.stringify(e.response?.data ?? e.message));
    }
  };

  const handleReturn = async (recordId) => {
    setError("");
    try {
      await returnBook(recordId);
      loadAll();
    } catch (e) {
      setError(JSON.stringify(e.response?.data ?? e.message));
    }
  };

  const statusBadge = (r) => {
    if (r.status === "RETURNED") return <span className="badge returned">Returned</span>;
    if (r.is_overdue) return <span className="badge overdue">Overdue</span>;
    return <span className="badge borrowed">Borrowed</span>;
  };

  return (
    <div>
      <h1>Borrow / Return</h1>

      <form className="inline-form" onSubmit={handleBorrow}>
        <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} required>
          <option value="">-- Select book --</option>
          {books.map((b) => (
            <option key={b.id} value={b.id} disabled={b.available_copies < 1}>
              {b.title} ({b.available_copies} available)
            </option>
          ))}
        </select>
        <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)} required>
          <option value="">-- Select member --</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.full_name}</option>
          ))}
        </select>
        <button type="submit">Borrow</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="inline-form">
        <label>Filter by status:&nbsp;</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="BORROWED">Borrowed</option>
          <option value="RETURNED">Returned</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Book</th><th>Member</th><th>Borrowed</th><th>Due</th>
            <th>Status</th><th>Fine</th><th></th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.book_title}</td>
              <td>{r.member_name}</td>
              <td>{new Date(r.borrowed_at).toLocaleDateString()}</td>
              <td>{r.due_date}</td>
              <td>{statusBadge(r)}</td>
              <td>{r.fine_amount > 0 ? `$${r.fine_amount}` : "-"}</td>
              <td>
                {r.status !== "RETURNED" && (
                  <button className="secondary" onClick={() => handleReturn(r.id)}>Return</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
