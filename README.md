# 🚀 Premium Motion Portfolio & Secure Contact Ingestion Engine

A high-performance, full-stack developer portfolio engineering showcase. This project pairs a fluid frontend user interface with a production-hardened REST API firewall layer to completely eliminate form spambots while maintaining fluid rendering pipelines.

🌐 **Live Production Frontend:** https://myportfolio-cbcd1.web.app
⚡ **Secure Ingestion Backend:**  https://my-portfolio-m57m.onrender.com

---

## 🛠️ Core Technology Stack

### Frontend Architecture
- **React.js & Vite:** High-velocity build toolchain with modular, single-page client component trees.
- **GSAP (GreenSock Animation Platform):** Multi-breakpoint desktop/mobile layout timelines, custom ticker scroll-trigger engines, and canvas particle network grids.
- **CSS3 Variables:** Modern fluid typography, responsive floating-label tracking, and glassmorphic micro-interactions.

### Backend Infrastructure
- **Node.js & Express.js:** Fast, asynchronous REST API runtime environment.
- **Resend SDK:** Transactional email delivery API communicating over secure HTTPS (Port 443).
- **Abstract API Platform:** External microservice integration executing multi-factor syntax and deliverability scans.

---

## 🔒 Enterprise-Grade Security Architecture

The full-stack pipeline incorporates a multi-tiered security perimeter, achieving excellent validation scores on **Mozilla Observatory web scans**:

*   **🛡️ HTTP Security Hardening (Helmet):** Implements modern server-side response headers to permanently mitigate vulnerabilities like Clickjacking, MIME-sniffing, and Cross-Site Scripting (XSS).
*   **📡 Strict CORS Boundary Verification:** Limits cross-origin data communication exclusively to verified development slots and the production live Firebase origin domain.
*   **🛑 Dynamic IP Blacklist限制 Middleware:** Reads upstream headers through Render's proxy layer to evaluate requests against a custom blacklist string array managed in-memory via Render's environment variable panel.
*   **⏱️ Request Velocity Rate-Limiting:** Employs `express-rate-limit` to restrict incoming connections to a maximum of **3 submission attempts per hour per IP**, neutralizing dynamic IP rotation spam scripts.
*   **🪤 Multi-Factor Ingestion Validation:**
    1.  *Honeypot Trap:* Captures automated scraper bots using an invisible, un-indexed input field that returns a fake `200 Success` status to trick scripts into abandoning loops.
    2.  *Abstract Mailbox Check:* Rejects invalid strings and throws a `400 Bad Request` block if the mailbox is explicitly flagged as `UNDELIVERABLE`.
    3.  *Server Length Sanitisation:* Rejects payloads if the name length is < 4 or > 25 characters, or if the message is < 10 characters, protecting server runtime bounds.

---

## 📂 Project Directory Structure

```text
├── backend/                  # Secure REST API runtime service
│   ├── node_modules/         # Server-side environment dependencies
│   ├── .env                  # Private system keys (Omitted from Git)
│   ├── .gitignore            # Security exclusion parameters
│   ├── package.json          # Production start scripts & package references
│   └── server.js             # Core API entry point, firewalls, and mail pathways
│
└── frontend/                 # High-fidelity user interface client
    ├── dist/                 # Optimized static web build bundle
    ├── src/
    │   ├── assets/           # CSS layout layers & visual assets
    │   └── components/       # Canvas, About, Projects, & Contact.jsx
    ├── firebase.json         # Strict CSP & hosting header configurations
    └── vite.config.js        # Asset bundling parameters
```

---

## 📜 Collaborative Engineering Credits

- **Designed, Built, and Maintained By:** Pranam Raj
- **Motion Optimization & Security Hardening Support:** Google Gemini AI

---
*Developed as a high-performance, modular architectural case study. Code architecture complies with production web security and data routing standards.*
