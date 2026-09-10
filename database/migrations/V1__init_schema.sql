-- V1__init_schema.sql
-- HostelHub Schema for Microsoft SQL Server (MSSQL)

-- 1. Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(100) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        full_name NVARCHAR(150) NOT NULL,
        email NVARCHAR(150) NOT NULL UNIQUE,
        phone NVARCHAR(50),
        role NVARCHAR(50) NOT NULL, -- 'ROLE_WARDEN', 'ROLE_STUDENT', 'ROLE_STAFF'
        avatar_url NVARCHAR(500),
        department NVARCHAR(100),
        block_assigned NVARCHAR(100),
        is_active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
END;

-- 2. Rooms Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'rooms')
BEGIN
    CREATE TABLE rooms (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        room_number NVARCHAR(50) NOT NULL,
        wing NVARCHAR(50) NOT NULL,       -- 'Wing A', 'Wing B', 'Wing C'
        floor INT NOT NULL,               -- 1, 2, 3, 4
        room_type NVARCHAR(50) NOT NULL,  -- 'Single AC', 'Double AC', 'Triple AC', 'Standard'
        capacity INT NOT NULL DEFAULT 3,
        occupied_beds INT NOT NULL DEFAULT 0,
        monthly_rent DECIMAL(10, 2) NOT NULL DEFAULT 1200.00,
        status NVARCHAR(50) NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'PARTIALLY_OCCUPIED', 'FULL', 'MAINTENANCE'
        created_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT UQ_rooms_number_wing UNIQUE (room_number, wing)
    );
END;

-- 3. Students Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'students')
BEGIN
    CREATE TABLE students (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT UNIQUE,
        roll_number NVARCHAR(100) NOT NULL UNIQUE,
        full_name NVARCHAR(150) NOT NULL,
        email NVARCHAR(150) NOT NULL,
        phone NVARCHAR(50) NOT NULL,
        room_id BIGINT NULL,
        bed_number NVARCHAR(20), -- 'Bed A', 'Bed B', 'Bed C'
        department NVARCHAR(100) NOT NULL, -- e.g. 'B.Tech CS'
        academic_year NVARCHAR(50) NOT NULL, -- e.g. '3rd Yr', '2nd Yr'
        guardian_name NVARCHAR(150),
        guardian_phone NVARCHAR(50),
        attendance_rate DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
        fee_status NVARCHAR(50) NOT NULL DEFAULT 'PAID', -- 'PAID', 'PENDING', 'OVERDUE'
        status NVARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'ON_LEAVE', 'SUSPENDED'
        avatar_url NVARCHAR(500),
        created_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT FK_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        CONSTRAINT FK_students_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
    );
END;

-- 4. Attendance Records Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'attendance_records')
BEGIN
    CREATE TABLE attendance_records (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        student_id BIGINT NOT NULL,
        record_date DATE NOT NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'PRESENT', -- 'PRESENT', 'ABSENT', 'LATE', 'LEAVE'
        check_in_time NVARCHAR(50),
        remarks NVARCHAR(500),
        marked_by_user_id BIGINT NULL,
        created_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT FK_attendance_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        CONSTRAINT FK_attendance_marked_by FOREIGN KEY (marked_by_user_id) REFERENCES users(id),
        CONSTRAINT UQ_student_attendance_date UNIQUE (student_id, record_date)
    );
END;

-- 5. Complaints Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'complaints')
BEGIN
    CREATE TABLE complaints (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        ticket_number NVARCHAR(50) NOT NULL UNIQUE,
        student_id BIGINT NOT NULL,
        room_id BIGINT NULL,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX) NOT NULL,
        category NVARCHAR(100) NOT NULL, -- 'Plumbing', 'Electrical', 'WiFi', 'Cleanliness', 'Carpentry', 'Discipline'
        priority NVARCHAR(50) NOT NULL DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'URGENT'
        status NVARCHAR(50) NOT NULL DEFAULT 'OPEN',     -- 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'
        assigned_staff NVARCHAR(150),
        resolution_notes NVARCHAR(MAX),
        created_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME2 NULL,
        CONSTRAINT FK_complaints_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        CONSTRAINT FK_complaints_room FOREIGN KEY (room_id) REFERENCES rooms(id)
    );
END;

-- 6. Fee Invoices Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'fee_invoices')
BEGIN
    CREATE TABLE fee_invoices (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        invoice_number NVARCHAR(50) NOT NULL UNIQUE,
        student_id BIGINT NOT NULL,
        fee_type NVARCHAR(100) NOT NULL, -- 'Hostel Term Fee', 'Mess & Dining', 'Security Deposit', 'Utility Charges'
        term_name NVARCHAR(100) NOT NULL, -- 'Fall 2024', 'Spring 2025'
        amount DECIMAL(10, 2) NOT NULL,
        due_date DATE NOT NULL,
        paid_date DATE NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PAID', 'PENDING', 'OVERDUE', 'PARTIAL'
        transaction_ref NVARCHAR(100),
        payment_mode NVARCHAR(50), -- 'UPI', 'Bank Transfer', 'Credit Card', 'Cash'
        notes NVARCHAR(500),
        created_at DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT FK_fee_invoices_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
END;

-- Indexes for performance
CREATE INDEX IX_users_username ON users(username);
CREATE INDEX IX_students_roll ON students(roll_number);
CREATE INDEX IX_rooms_wing_floor ON rooms(wing, floor);
CREATE INDEX IX_attendance_date ON attendance_records(record_date);
CREATE INDEX IX_complaints_status ON complaints(status);
CREATE INDEX IX_fee_invoices_status ON fee_invoices(status);
