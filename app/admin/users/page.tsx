"use client";
import { useState } from "react";

const roles = ["client", "attorney", "employer", "admin"] as const;
const categories = ["Worker", "Legal", "Employer", "Institutional"] as const;

const mockUsers = [
  { id: "1", email: "admin@ivyar.org", role: "admin", category: "Institutional", createdAt: "2025-01-01" },
  { id: "2", email: "employer@ivyar.org", role: "employer", category: "Employer", createdAt: "2025-01-01" },
  { id: "3", email: "attorney@ivyar.org", role: "attorney", category: "Legal", createdAt: "2025-01-01" },
  { id: "4", email: "client@ivyar.org", role: "client", category: "Worker", createdAt: "2025-01-01" },
];

export default function UserManagementPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<typeof roles[number]>("client");
  const [category, setCategory] = useState<typeof categories[number]>("Worker");
  const [message, setMessage] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST to /api/admin/users
    setMessage(`User ${email} created successfully!`);
    setShowCreate(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A", color: "white", fontFamily: "system-ui" }}>
      {/* Header */}
      <div style={{ background: "#1B3A5C", padding: "20px 40px", borderBottom: "1px solid #2D4A6A" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px" }}>👥 User Management</h1>
            <p style={{ margin: "8px 0 0", color: "#A8B5C4" }}>Manage platform users and access</p>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <button
              onClick={() => setShowCreate(true)}
              style={{ padding: "10px 20px", background: "#10B9B9", border: "none", borderRadius: "6px", color: "white", cursor: "pointer", fontWeight: "600" }}
            >
              + Create User
            </button>
            <a href="/admin" style={{ color: "#10B9B9", textDecoration: "none", alignSelf: "center" }}>← Back</a>
          </div>
        </div>
      </div>

      <div style={{ padding: "32px 40px" }}>
        {message && (
          <div style={{ background: "#10B98130", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
            <p style={{ margin: 0, color: "#10B981" }}>{message}</p>
          </div>
        )}

        {/* Users Table */}
        <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0D1B2A" }}>
                <th style={{ padding: "16px", textAlign: "left", color: "#A8B5C4" }}>Email</th>
                <th style={{ padding: "16px", textAlign: "left", color: "#A8B5C4" }}>Role</th>
                <th style={{ padding: "16px", textAlign: "left", color: "#A8B5C4" }}>Category</th>
                <th style={{ padding: "16px", textAlign: "left", color: "#A8B5C4" }}>Created</th>
                <th style={{ padding: "16px", textAlign: "left", color: "#A8B5C4" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} style={{ borderTop: "1px solid #2D4A6A" }}>
                  <td style={{ padding: "16px" }}>{user.email}</td>
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      background: user.role === "admin" ? "#EF444430" : "#10B9B930",
                      color: user.role === "admin" ? "#EF4444" : "#10B9B9",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      textTransform: "capitalize",
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "16px", color: "#A8B5C4" }}>{user.category}</td>
                  <td style={{ padding: "16px", color: "#6B7280" }}>{user.createdAt}</td>
                  <td style={{ padding: "16px" }}>
                    <button style={{ padding: "6px 12px", background: "#2D4A6A", border: "none", borderRadius: "4px", color: "white", cursor: "pointer", marginRight: "8px" }}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create User Modal */}
        {showCreate && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowCreate(false)}>
            <div style={{ background: "#1B3A5C", padding: "32px", borderRadius: "16px", width: "400px" }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ margin: "0 0 24px" }}>Create New User</h2>
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", color: "#A8B5C4", marginBottom: "8px" }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "none", background: "#0D1B2A", color: "white", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", color: "#A8B5C4", marginBottom: "8px" }}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "none", background: "#0D1B2A", color: "white", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", color: "#A8B5C4", marginBottom: "8px" }}>Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "none", background: "#0D1B2A", color: "white" }}
                  >
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", color: "#A8B5C4", marginBottom: "8px" }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "none", background: "#0D1B2A", color: "white" }}
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button type="submit" style={{ flex: 1, padding: "12px", background: "#10B9B9", border: "none", borderRadius: "6px", color: "white", cursor: "pointer", fontWeight: "600" }}>
                    Create
                  </button>
                  <button type="button" onClick={() => setShowCreate(false)} style={{ flex: 1, padding: "12px", background: "#2D4A6A", border: "none", borderRadius: "6px", color: "white", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}