# HostelHub - CampusHostel Management System

A full-stack, enterprise-grade hostel management web application built with **React 18 + Vite** (Tailwind CSS) and **Spring Boot 3.x** (Spring Security + JWT + Spring Data JPA), backed by **Microsoft SQL Server (MSSQL)** with **Flyway** schema versioning.

The user interface reproduces the **HostelHub / CampusHostel** collegiate design system designed in Stitch, featuring responsive layouts, role-based controls, real-time facility telemetry, room allocation matrices, curfew attendance tracking, complaints ticketing, and student fee collection ledgers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios |
| **Backend** | Spring Boot 3.3.x, Java 17+, Spring Data JPA, Hibernate, Flyway |
| **Security** | Spring Security 6, Stateless JWT Authentication, BCrypt |
| **Database** | Microsoft SQL Server (MSSQL) with Flyway migrations |

---

## Project Structure

```text
├── database/
│   └── migrations/                  # Versioned Flyway SQL migration scripts
│       ├── V1__init_schema.sql      # Core schema (users, rooms, students, attendance, complaints, fees)
│       └── V2__seed_data.sql        # Realistic initial dataset matching Stitch screens
│
├── backend/
│   ├── src/main/java/com/yourorg/appname/
│   │   ├── config/                  # SecurityConfig (JWT filter chain) & CorsConfig
│   │   ├── controller/              # REST Controllers (/api/auth, /api/dashboard, /api/students, etc.)
│   │   ├── dto/                     # Request & Response DTOs
│   │   ├── entity/                  # JPA Entities (User, Student, Room, AttendanceRecord, etc.)
│   │   ├── exception/               # GlobalExceptionHandler with ApiResponse model
│   │   ├── mapper/                  # DTO <-> Entity mappings
│   │   ├── repository/              # Spring Data JPA Repositories
│   │   ├── security/                # JwtUtil, JwtAuthFilter, CustomUserDetailsService
│   │   └── service/                 # Interfaces and Service Implementations
│   ├── src/main/resources/
│   │   ├── application.properties   # MSSQL database and Flyway settings
│   │   └── db/migration/            # Classpath Flyway migrations
│   └── pom.xml                      # Maven project definition
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Badge, StatTile, Modal, etc.
│   │   │   └── layout/              # Header, Drawer, BottomNav, MainLayout
│   │   ├── context/                 # AuthContext (JWT & active role management)
│   │   ├── pages/
│   │   │   ├── Auth/                # Stitch Institutional Login (with Quick Demo fills)
│   │   │   ├── Dashboard/           # Warden Executive Console & Student Resident Portal
│   │   │   ├── Students/            # Student roster, filters, search & dossier
│   │   │   ├── Rooms/               # Room inventory, floor selector & bed allocation
│   │   │   ├── Attendance/          # Curfew roll call, date filter & quick toggles
│   │   │   ├── Complaints/          # Maintenance desk, priority chips & ticket resolution
│   │   │   └── Fees/                # Vault collections, overdue reminders & receipt settlement
│   │   ├── routes/                  # AppRoutes.jsx, ProtectedRoute.jsx
│   │   ├── services/                # apiClient.js (Axios + JWT interceptor) & module APIs
│   │   └── utils/                   # Formatting utilities (currency, dates, badges)
│   ├── index.html
│   ├── tailwind.config.js           # Stitch theme tokens, Plus Jakarta Sans & Inter
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18+ (tested on v24)
- **Java Development Kit (JDK)**: JDK 17 or higher
- **Maven**: 3.8+ (or Maven wrapper)
- **Microsoft SQL Server**: Local SQL Server instance, SQL Server Express, or Azure SQL Database

---

### 1. Database Profiles (H2 vs Microsoft SQL Server)

The application supports dual database profiles:

#### A. Instant In-Memory Mode (`h2` - Default)
**No database installation required!** The application starts immediately using an embedded H2 in-memory database pre-loaded with all tables and realistic demo data matching the Stitch design.
- Active by default in `application.properties` (`spring.profiles.active=h2`).
- Web Console available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:hostelhub_db`, User: `sa`, Password: empty).

#### B. Microsoft SQL Server Mode (`mssql`)
When you are ready to connect to a real Microsoft SQL Server instance:
1. Create a database in your SQL Server instance (via SSMS, Azure Data Studio, or `sqlcmd`):
   ```sql
   CREATE DATABASE hostelhub_db;
   ```
2. Verify connection settings in `backend/src/main/resources/application-mssql.properties`:
   ```properties
   spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=hostelhub_db;encrypt=true;trustServerCertificate=true;
   spring.datasource.username=sa
   spring.datasource.password=YourStrongPassword123!
   ```
3. Activate the profile either in `application.properties`:
   ```properties
   spring.profiles.active=mssql
   ```
   Or pass it at runtime:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=mssql
   ```

> **Flyway Schema Versioning**: Flyway automatically executes migrations from `db/migration/h2` or `db/migration/mssql` based on the active profile, creating all schemas and seeding initial test records.

---

### 2. Run the Backend

#### In IntelliJ IDEA
Simply open the project in IntelliJ IDEA and run **`HostelHubApplication`**. It will automatically start with the default `h2` profile and bind to port **`8080`**.

#### Via Maven Command Line
```bash
cd backend
mvn spring-boot:run
```

The Spring Boot backend will start on **`http://localhost:8080`**.

---

### 3. Run the Frontend

Navigate to the `frontend` directory, install dependencies, and launch Vite:

```bash
cd frontend
npm install
npm run dev
```

The React + Vite application will open at **`http://localhost:5173`**.

---

## Pre-configured Demo Accounts

On the `/login` screen, use the **Quick Demo Fill** buttons to automatically authenticate as either persona:

| Role | Username / ID | Password | Access & Views |
|---|---|---|---|
| **Chief Warden** | `WARDEN-104` | `password123` | Full administrative console, facility telemetry, room assignment, curfew roll call, complaint resolution, fee collection ledger |
| **Student Resident** | `STU-2024-089` | `password123` | Resident dashboard, personal room status, roommate roster, roll call streak, maintenance ticket submission |

---

## API Endpoints Overview

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/auth/login` | Authenticate user and receive JWT |
| | `POST` | `/api/auth/register` | Register new account |
| | `GET` | `/api/auth/me` | Fetch authenticated user profile |
| **Dashboard** | `GET` | `/api/dashboard/warden` | Overall facility telemetry counts & financials |
| | `GET` | `/api/dashboard/student` | Resident personal room, roommate & fee status |
| **Students** | `GET` | `/api/students` | Search and filter students by wing/fee status |
| | `POST` | `/api/students` | Register student and optionally allocate room |
| | `PUT` | `/api/students/{id}` | Update student records |
| | `DELETE`| `/api/students/{id}` | Remove student record |
| **Rooms** | `GET` | `/api/rooms` | Query rooms by wing, floor, or status |
| | `POST` | `/api/rooms` | Add room inventory unit |
| | `POST` | `/api/rooms/{id}/assign/{studentId}` | Allocate specific bed to resident |
| | `DELETE`| `/api/rooms/{id}/remove/{studentId}` | Unassign resident from room |
| **Attendance** | `GET` | `/api/attendance` | Roll call status for specific date & sector |
| | `POST` | `/api/attendance` | Mark single resident status (`PRESENT`, `LATE`, `ABSENT`, `LEAVE`) |
| | `POST` | `/api/attendance/batch` | Batch mark attendance for entire wing/floor |
| **Complaints** | `GET` | `/api/complaints` | Filter work orders by category, priority, status |
| | `POST` | `/api/complaints` | Submit maintenance or disciplinary ticket |
| | `PATCH`| `/api/complaints/{id}/status` | Update ticket status (`IN_PROGRESS`, `RESOLVED`) & staff notes |
| **Fees** | `GET` | `/api/fees` | Query ledger invoices (All, Pending, Paid) |
| | `POST` | `/api/fees` | Generate student fee invoice |
| | `POST` | `/api/fees/{id}/pay` | Record payment settlement (UPI, Bank Wire, POS, Cash) |
| | `POST` | `/api/fees/{id}/remind` | Dispatch reminder notice to student & guardian |
#   n e w _ p r o  
 