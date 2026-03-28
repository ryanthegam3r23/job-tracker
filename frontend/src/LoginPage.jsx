import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Wrong Email/Password.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center" }}>
          💼 {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.primaryBtn} onClick={handleSubmit}>
          {isRegistering ? "Register" : "Log In"}
        </button>

        <p style={{ textAlign: "center", marginTop: 10 }}>
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            style={{ color: "#3b82f6", cursor: "pointer" }}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Log In" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f6f7fb" },
  card: { background: "white", padding: 30, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: 12, width: 340 },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ddd" },
  primaryBtn: { padding: 10, borderRadius: 8, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontWeight: "bold" },
};