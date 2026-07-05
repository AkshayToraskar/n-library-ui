export default function Home() {
  return (
    <div>
      <h1>Neighborhood Library Service</h1>
      <p className="muted">
        Manage books, members, and lending operations. Use the nav above to:
      </p>
      <ul>
        <li><strong>Books</strong> — add and edit titles, see how many copies are available.</li>
        <li><strong>Members</strong> — add and edit library patrons.</li>
        <li><strong>Borrow / Return</strong> — check books out to members, mark returns, and see who has what.</li>
      </ul>
    </div>
  );
}