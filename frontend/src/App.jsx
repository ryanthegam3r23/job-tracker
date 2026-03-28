import { useEffect, useState } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

function App() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");
  const [editingJob, setEditingJob] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/applications/";

  // GET JOBS
  const fetchJobs = async () => {
    try {
      const res = await axios.get(API_URL);
      setJobs(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // CREATE
  const handleCreate = async () => {
    try {
      const res = await axios.post(API_URL, {
        company,
        position,
        status,
      });

      setJobs([...jobs, res.data]);

      setCompany("");
      setPosition("");
      setStatus("applied");
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // START EDIT
  const startEdit = (job) => {
    setEditingJob(job);
    setCompany(job.company);
    setPosition(job.position);
    setStatus(job.status);
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API_URL}${editingJob.id}/`, {
        company,
        position,
        status,
      });

      setJobs(
        jobs.map((job) =>
          job.id === editingJob.id ? res.data : job
        )
      );

      setEditingJob(null);
      setCompany("");
      setPosition("");
      setStatus("applied");
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // =========================
  // 📊 ANALYTICS
  // =========================

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
  ];

  const COLORS = ["#3b82f6", "#f59e0b", "#22c55e", "#ef4444"];

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "#3b82f6";
      case "interview":
        return "#f59e0b";
      case "offer":
        return "#22c55e";
      case "rejected":
        return "#ef4444";
      default:
        return "#999";
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>💼 Job Tracker Dashboard</h1>

      {/* STATS */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>Total</h3>
          <p>{stats.total}</p>
        </div>

        <div style={styles.statCard}>
          <h3>Applied</h3>
          <p style={{ color: "#3b82f6" }}>{stats.applied}</p>
        </div>

        <div style={styles.statCard}>
          <h3>Interview</h3>
          <p style={{ color: "#f59e0b" }}>{stats.interview}</p>
        </div>

        <div style={styles.statCard}>
          <h3>Offer</h3>
          <p style={{ color: "#22c55e" }}>{stats.offer}</p>
        </div>

        <div style={styles.statCard}>
          <h3>Rejected</h3>
          <p style={{ color: "#ef4444" }}>{stats.rejected}</p>
        </div>
      </div>

      {/* CHART */}
      <div style={styles.chartContainer}>
        <h2 style={{ textAlign: "center" }}>Status Breakdown</h2>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <PieChart width={320} height={320}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* FORM */}
      <div style={styles.formCard}>
        <input
          style={styles.input}
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />

        <select
          style={styles.input}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          style={styles.primaryBtn}
          onClick={editingJob ? handleUpdate : handleCreate}
        >
          {editingJob ? "Update Job" : "Add Job"}
        </button>
      </div>

      {/* JOB LIST */}
      <div style={styles.grid}>
        {jobs.map((job) => (
          <div key={job.id} style={styles.card}>
            <div style={styles.cardTop}>
              <h3 style={{ margin: 0 }}>{job.company}</h3>

              <span
                style={{
                  ...styles.badge,
                  background: getStatusColor(job.status),
                }}
              >
                {job.status}
              </span>
            </div>

            <p style={{ color: "#555" }}>{job.position}</p>

            <div style={styles.actions}>
              <button style={styles.editBtn} onClick={() => startEdit(job)}>
                Edit
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(job.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================
// 🎨 STYLES
// =========================

const styles = {
  page: {
    padding: 20,
    fontFamily: "Arial",
    background: "#f6f7fb",
    minHeight: "100vh",
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 10,
    maxWidth: 900,
    margin: "0 auto 20px",
  },

  statCard: {
    background: "white",
    padding: 12,
    borderRadius: 10,
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  chartContainer: {
    marginTop: 20,
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    maxWidth: 600,
    marginLeft: "auto",
    marginRight: "auto",
  },

  formCard: {
    maxWidth: 500,
    margin: "20px auto",
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  primaryBtn: {
    padding: 10,
    borderRadius: 8,
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 15,
    marginTop: 20,
  },

  card: {
    background: "white",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badge: {
    padding: "4px 8px",
    borderRadius: 999,
    color: "white",
    fontSize: 12,
  },

  actions: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },

  editBtn: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    border: "none",
    background: "#f59e0b",
    color: "white",
    cursor: "pointer",
  },

  deleteBtn: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },
};

export default App;







