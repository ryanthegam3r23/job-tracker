import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>💼</div>
        <h1 style={s.title}>Job Tracker</h1>
        <p style={s.subtitle}>{isRegistering ? "Create your account" : "Sign in to your account"}</p>

        {error && <div style={s.error}>{error}</div>}

        <input
          style={s.input}
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <input
          style={s.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <button style={s.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : isRegistering ? "Create Account" : "Sign In"}
        </button>

        <p style={s.toggle}>
          {isRegistering ? "Already have an account? " : "Don't have an account? "}
          <span style={s.link} onClick={() => { setIsRegistering(!isRegistering); setError(""); }}>
            {isRegistering ? "Sign in" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    background: "white",
    borderRadius: 16,
    padding: "40px 32px",
    width: "100%",
    maxWidth: 400,
    boxSizing: "border-box",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  logo: { fontSize: 40, textAlign: "center", marginBottom: 8 },
  title: { margin: "0 0 4px", textAlign: "center", fontSize: 24, fontWeight: 700, color: "#111" },
  subtitle: { margin: "0 0 24px", textAlign: "center", fontSize: 14, color: "#888" },
  error: {
    background: "#fef2f2",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
  },
  input: {
    display: "block",
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1.5px solid #e5e7eb",
    fontSize: 15,
    marginBottom: 12,
    boxSizing: "border-box",
    outline: "none",
  },
  btn: {
    display: "block",
    width: "100%",
    padding: "13px",
    borderRadius: 10,
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 4,
  },
  toggle: { textAlign: "center", fontSize: 14, color: "#888", marginTop: 20, marginBottom: 0 },
  link: { color: "#3b82f6", cursor: "pointer", fontWeight: 500 },
};