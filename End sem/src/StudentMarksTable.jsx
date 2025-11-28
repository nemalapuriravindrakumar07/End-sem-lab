import React, { useMemo, useState } from "react";

export default function StudentMarksTable() {
  // initial sample data
  const [rows, setRows] = useState([
    { id: 1, name: "Alice", subject: "Math", marks: 92 },
    { id: 2, name: "Bob", subject: "Physics", marks: 78 },
    { id: 3, name: "Charlie", subject: "Chemistry", marks: 85 },
    { id: 4, name: "Diana", subject: "Math", marks: 69 },
    { id: 5, name: "Ethan", subject: "Physics", marks: 88 },
  ]);

  // filters & sorting state
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [minMarks, setMinMarks] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); 

  // form for adding new record
  const [form, setForm] = useState({ name: "", subject: "", marks: "" });

  // derive subjects for dropdown
  const subjects = useMemo(() => {
    const setSub = new Set(rows.map((r) => r.subject));
    return ["All", ...Array.from(setSub).sort()];
  }, [rows]);

  // Sorting handler (cycles asc -> desc -> none)
  function handleSort(key) {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") return { key, direction: "desc" };
      if (prev.direction === "desc") return { key: null, direction: null };
      return { key, direction: "asc" };
    });
  }

  // apply filters + sorting
  const filteredRows = useMemo(() => {
    let data = [...rows];

    // filter by subject
    if (subjectFilter !== "All") {
      data = data.filter((r) => r.subject === subjectFilter);
    }

    // filter by marks range
    if (minMarks !== "") data = data.filter((r) => r.marks >= Number(minMarks));
    if (maxMarks !== "") data = data.filter((r) => r.marks <= Number(maxMarks));

    // sorting
    if (sortConfig.key) {
      data.sort((a, b) => {
        const x = a[sortConfig.key];
        const y = b[sortConfig.key];

        if (x < y) return sortConfig.direction === "asc" ? -1 : 1;
        if (x > y) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [rows, subjectFilter, minMarks, maxMarks, sortConfig]);

  // add new record
  function handleAdd(e) {
    e.preventDefault();
    if (!form.name || !form.subject || !form.marks) return;

    setRows((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: form.name,
        subject: form.subject,
        marks: Number(form.marks),
      },
    ]);

    setForm({ name: "", subject: "", marks: "" });
  }

  return (
    <div className="bg-white shadow-xl rounded-xl p-6">
      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Subject Filter */}
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="p-2 border rounded"
        >
          {subjects.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        {/* Marks Range */}
        <input
          type="number"
          placeholder="Min Marks"
          value={minMarks}
          onChange={(e) => setMinMarks(e.target.value)}
          className="p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Max Marks"
          value={maxMarks}
          onChange={(e) => setMaxMarks(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {["name", "subject", "marks"].map((key) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="p-3 text-left cursor-pointer select-none"
              >
                {key.toUpperCase()}{" "}
                {sortConfig.key === key &&
                  (sortConfig.direction === "asc" ? "▲" : "▼")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredRows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-100">
              <td className="p-3">{row.name}</td>
              <td className="p-3">{row.subject}</td>
              <td className="p-3">{row.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add new student */}
      <form
        onSubmit={handleAdd}
        className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Marks"
          value={form.marks}
          onChange={(e) => setForm({ ...form, marks: e.target.value })}
          className="p-2 border rounded"
        />

        <button className="bg-blue-600 text-white rounded p-2">
          Add Student
        </button>
      </form>
    </div>
  );
}
