# IVYAR Security & Governance Framework

**Institutional Security & Access Control**

---

## 1. Access Control (RBAC)

### Roles

| Role | Access Level | Category |
|------|--------------|----------|
| `client` | Client Portal | Worker |
| `attorney` | Client Portal + Legal Tools | Legal |
| `employer` | Employer Dashboard | Employer |
| `admin` | Full Platform Access | Institutional |

### Protected Routes

| Path | Allowed Roles |
|------|---------------|
| `/client/*` | client, attorney, admin |
| `/legal/*` | attorney, admin |
| `/employer/*` | employer, admin |
| `/admin/*` | admin |

---

## 2. Authentication

### JWT Token Structure
```json
{
  "userId": "usr-xxx",
  "email": "user@example.com",
  "role": "client",
  "category": "Worker",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Security Measures

- HttpOnly cookies (XSS protection)
- Secure flag in production
- SameSite=Lax (CSRF protection)
- 7-day token expiration

---

## 3. Login Audit

### Captured Data

| Field | Description |
|-------|-------------|
| `email` | Attempted login email |
| `userId` | User ID (if matched) |
| `success` | Boolean result |
| `ipAddress` | Client IP |
| `userAgent` | Browser/device info |
| `timestamp` | Event time |

### Retention

- Minimum: 3 years
- Immutable: No updates/deletes
- Exportable: CSV, JSON, PDF

---

## 4. Security Alerts

### Alert Types

| Type | Trigger | Severity |
|------|---------|----------|
| `FAILED_LOGIN_BURST` | 5+ failures in 10min | High |
| `NEW_ADMIN_IP` | Admin from new IP | Medium |
| `MULTI_ACCOUNT_IP` | Multiple accounts, same IP | Medium |
| `GEO_ANOMALY` | Unusual location | Low |

### Severity Levels

- **Critical** — Immediate action required
- **High** — Review within 1 hour
- **Medium** — Review within 24 hours
- **Low** — Informational

---

## 5. Compliance

This framework supports:

- SOC2 Type II (CC6.1, CC6.2)
- ISO27001 (A.12.4)
- NIST (AC-7)
- GDPR (Article 30)

---

## 6. Contact

**IVYAR Platform**  
Institutional Architecture & Governance  
Lake Stevens, Washington, USA  
security@ivyar.org

---

*© 2026 IVYAR Platform. All rights reserved.*