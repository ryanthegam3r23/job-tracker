import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import LoginPage from "./LoginPage";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

function App() {
  const { token, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");
  const [editingJob, setEditingJob] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const API_URL = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/applications/`;

  const fetchJobs = async () => {
    try {
      const res = await axios.get(API_URL);
      setJobs(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  useEffect(() => {
    if (token) fetchJobs();
  }, [token]);

  const handleCreate = async () => {
    try {
      const res = await axios.post(API_URL, { company, position, status });
      setJobs([...jobs, res.data]);
      setCompany(""); setPosition(""); setStatus("applied");
      setShowForm(false);
    } catch (err) { console.log(err.response?.data); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (err) { console.log(err.response?.data); }
  };

  const startEdit = (job) => {
    setEditingJob(job);
    setCompany(job.company);
    setPosition(job.position);
    setStatus(job.status);
    setShowForm(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API_URL}${editingJob.id}/`, { company, position, status });
      setJobs(jobs.map((job) => job.id === editingJob.id ? res.data : job));
      setEditingJob(null);
      setCompany(""); setPosition(""); setStatus("applied");
      setShowForm(false);
    } catch (err) { console.log(err.response?.data); }
  };

  const cancelForm = () => {
    setEditingJob(null);
    setCompany(""); setPosition(""); setStatus("applied");
    setShowForm(false);
  };

  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "applied").length,
    interview: jobs.filter((j) => j.status === "interview").length,
    offer: jobs.filter((j) => j.status === "offer").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  };

  const chartData = [
    { name: "Applied", value: stats.applied },
    { name: "Interview", value: stats.interview },
    { name: "Offer", value: stats.offer },
    { name: "Rejected", value: stats.rejected },
  ].filter(d => d.value > 0);

 const COLORS = {
  Applied: "#3b82f6",
  Interview: "#f59e0b",
  Offer: "#22c55e",
  Rejected: "#ef4444",
};
  const statusColor = (s) => ({
    applied: "#3b82f6", interview: "#f59e0b", offer: "#22c55e", rejected: "#ef4444"
  }[s] || "#999");

  const statusBg = (s) => ({
    applied: "#eff6ff", interview: "#fffbeb", offer: "#f0fdf4", rejected: "#fef2f2"
  }[s] || "#f9fafb");

  if (!token) return <LoginPage />;

  return (
    <div style={s.page}>

      {/* HEADER */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <span style={{ fontSize: 22 }}>💼</span>
          <span style={s.headerTitle}>Job Tracker</span>
        </div>
        <button style={s.logoutBtn} onClick={logout}>Sign out</button>
      </div>

      <div style={s.content}>

        {/* STAT CARDS */}
        <div style={s.statsGrid}>
          {[
            { label: "Total", value: stats.total, color: "#111" },
            { label: "Applied", value: stats.applied, color: "#3b82f6" },
            { label: "Interview", value: stats.interview, color: "#f59e0b" },
            { label: "Offer", value: stats.offer, color: "#22c55e" },
            { label: "Rejected", value: stats.rejected, color: "#ef4444" },
          ].map(({ label, value, color }) => (
            <div key={label} style={s.statCard}>
              <p style={s.statLabel}>{label}</p>
              <p style={{ ...s.statValue, color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* CHART */}
        {chartData.length > 0 && (
          <div style={s.card}>
            <p style={s.sectionTitle}>Status breakdown</p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {chartData.map((entry, i) => <Cell key={i} fill={COLORS[entry.name]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ADD JOB BUTTON */}
        {!showForm && (
          <button style={s.addBtn} onClick={() => setShowForm(true)}>
            + Add job
          </button>
        )}

        {/* FORM */}
        {showForm && (
          <div style={s.card}>
            <p style={s.sectionTitle}>{editingJob ? "Edit job" : "Add a new job"}</p>
            <input
              style={s.input}
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <input
              style={s.input}
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <select style={s.input} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
            <div style={s.formActions}>
              <button style={s.cancelBtn} onClick={cancelForm}>Cancel</button>
              <button style={s.primaryBtn} onClick={editingJob ? handleUpdate : handleCreate}>
                {editingJob ? "Save changes" : "Add job"}
              </button>
            </div>
          </div>
        )}

        {/* JOB LIST */}
        <div style={s.jobList}>
          {jobs.length === 0 && (
            <div style={s.emptyState}>
              <p style={{ fontSize: 32, margin: 0 }}>📋</p>
              <p style={{ color: "#888", marginTop: 8 }}>No jobs yet. Add your first one!</p>
            </div>
          )}
          {jobs.map((job) => (
            <div key={job.id} style={s.jobCard}>
              <div style={s.jobTop}>
                <div>
                  <p style={s.jobCompany}>{job.company}</p>
                  <p style={s.jobPosition}>{job.position}</p>
                </div>
                <span style={{ ...s.badge, color: statusColor(job.status), background: statusBg(job.status) }}>
                  {job.status}
                </span>
              </div>
              <div style={s.jobActions}>
                <button style={s.editBtn} onClick={() => startEdit(job)}>Edit</button>
                <button style={s.deleteBtn} onClick={() => handleDelete(job.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const s = {
  page: { background: "#f6f7fb", minHeight: "100vh", fontFamily: "Arial, sans-serif" },
  header: {
    background: "white",
    borderBottom: "1px solid #e5e7eb",
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 17, fontWeight: 700, color: "#111" },
  logoutBtn: {
    padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb",
    background: "white", color: "#555", fontSize: 13, cursor: "pointer",
  },
  content: { maxWidth: 680, margin: "0 auto", padding: "20px 16px", boxSizing: "border-box" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    background: "white", borderRadius: 12, padding: "12px 10px",
    textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  statLabel: { margin: 0, fontSize: 12, color: "#888", marginBottom: 4 },
  statValue: { margin: 0, fontSize: 22, fontWeight: 700 },
  card: {
    background: "white", borderRadius: 14, padding: "18px 16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)", marginBottom: 16,
  },
  sectionTitle: { margin: "0 0 14px", fontSize: 15, fontWeight: 600, color: "#111" },
  addBtn: {
    width: "100%", padding: "13px", borderRadius: 12, border: "2px dashed #d1d5db",
    background: "white", color: "#3b82f6", fontSize: 15, fontWeight: 600,
    cursor: "pointer", marginBottom: 16,
  },
  input: {
    display: "block", width: "100%", padding: "11px 13px", borderRadius: 10,
    border: "1.5px solid #e5e7eb", fontSize: 15, marginBottom: 10,
    boxSizing: "border-box", outline: "none",
  },
  formActions: { display: "flex", gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1, padding: 11, borderRadius: 10, border: "1.5px solid #e5e7eb",
    background: "white", color: "#555", fontSize: 14, cursor: "pointer",
  },
  primaryBtn: {
    flex: 2, padding: 11, borderRadius: 10, border: "none",
    background: "#3b82f6", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer",
  },
  jobList: { display: "flex", flexDirection: "column", gap: 10 },
  emptyState: { textAlign: "center", padding: "40px 0" },
  jobCard: {
    background: "white", borderRadius: 14, padding: "14px 16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  jobTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  jobCompany: { margin: 0, fontSize: 16, fontWeight: 600, color: "#111" },
  jobPosition: { margin: "3px 0 0", fontSize: 14, color: "#666" },
  badge: {
    padding: "4px 10px", borderRadius: 999, fontSize: 12,
    fontWeight: 600, whiteSpace: "nowrap",
  },
  jobActions: { display: "flex", gap: 8 },
  editBtn: {
    flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid #e5e7eb",
    background: "white", color: "#f59e0b", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  deleteBtn: {
    flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid #fecaca",
    background: "#fef2f2", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
};

export default App;





