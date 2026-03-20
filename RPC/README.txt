GaitPhysioClinic standalone project

Code names:
- PhysioShift = physiotherapy version
- DentalRestore = switch back to dental version

Local setup:
1. Open terminal in D:\AI\Codex\RPC
2. Run: npm install
3. Run: npm run dev

Local URLs:
- http://localhost:8890/index.html
- http://localhost:8890/doctors-login.html
- http://localhost:8890/analytics.html

Important:
- This project is standalone and does not need the parent dental project to run.
- The local dev command explicitly serves the RPC folder so Netlify does not fall back to the dental site.

Required env vars:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVER_KEY

Server-side features that require SUPABASE_SERVER_KEY:
- Manage Users
- Current Access Users
- Reset Past Data
