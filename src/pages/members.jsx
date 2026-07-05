import { useEffect, useState } from "react";
import { listMembers, createMember, updateMember } from "../../lib/api";

const emptyForm = { full_name: "", email: "", phone: "", address: "" };

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await listMembers();
      setMembers(res.data.results ?? res.data);
    } catch (e) {
      setError("Could not load members. Is the backend running?");
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateMember(editingId, form);
      } else {
        await createMember(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (e) {
      setError(JSON.stringify(e.response?.data ?? e.message));
    }
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setForm({ full_name: m.full_name, email: m.email, phone: m.phone ?? "", address: m.address ?? "" });
  };

  return (
    <div>
      <h1>Members</h1>

      <form className="inline-form" onSubmit={handleSubmit}>
        <input name="full_name" placeholder="Full name" value={form.full_name} onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <button type="submit">{editingId ? "Update Member" : "Add Member"}</button>
        {editingId && (
          <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th></th></tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.full_name}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td>{m.membership_date}</td>
              <td><button onClick={() => startEdit(m)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
