# CRUD Application: Laravel‑Style Web App

## 📌 Project Overview  
This project is a full‑stack web application that demonstrates the classic CRUD operations (Create, Read, Update, Delete) using a modern tech stack. The front‑end is built using HTML, CSS and JavaScript; the back‑end uses Node.js, Express and MySQL.  
Users can create new records, view them in a list, edit them or delete them — all with data persistence in a MySQL database.

### Key Features:  
- Responsive UI that works on desktop and mobile  
- Clean, intuitive forms and table listings for data management  
- Back‑end API endpoints for all CRUD operations (REST‑style)  
- Data stored in MySQL with a well‑defined structure  
- Environment variable configuration, making it ready for deployment  
- Simple to extend or customise (e.g., add more fields, more tables)  

## 🧰 Technology Stack  
- **Front‑end**: HTML, CSS (with a lavender‑themed color palette), JavaScript  
- **Back‑end**: Node.js + Express  
- **Database**: MySQL (via `mysql2` npm package)  
- **Environment Config**: `.env` file to store sensitive credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)  
- **Deployment Ready**: Uses `process.env.PORT` for listening, CORS configured, ready for cloud deployment  

## 📂 Project Structure  
/backend
|– server.js ← Main Express server entry point
|– config/
|– db.config.js ← MySQL connection configuration
|– controllers/
|– record.controller.js ← CRUD logic for “records”
|– models/
|– record.model.js ← MySQL queries for “records” table
|– routes/
|– record.routes.js ← Express routes for API endpoints
/frontend
|– index.html ← Main UI page
|– styles.css ← Styles (lavender theme)
|– script.js ← Front‑end JavaScript for interacting with API
.env ← Environment variables
README.md ← Project documentation (this file)

## 🎬 How It Works  
1. **Create** – A user fills the form (name, email, age) and submits. The front‑end sends a `POST` request to `/api/records`. The server inserts into MySQL and returns the inserted record (including its `id`).  
2. **Read** – On load (and when data changes), the front‑end sends a `GET` request to `/api/records`. The server returns a list of all records.  
3. **Update** – The user presses “Edit”, edits fields; the front‑end sends a `PUT` request to `/api/records/:id`. The server updates the record in MySQL and returns the updated record.  
4. **Delete** – The user presses “Delete”; front‑end sends a `DELETE` request to `/api/records/:id`. The server deletes the record and returns a confirmation message.  
All changes are reflected in real time in the table UI and persisted in the database.
