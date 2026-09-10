-- V2__seed_data.sql (H2 Dialect)

-- 1. Seed Users (password is 'password123')
INSERT INTO users (username, password, full_name, email, phone, role, avatar_url, department, block_assigned, is_active)
VALUES 
('WARDEN-104', '$2a$10$lKb4wot.KEzR2LSDEVMky.NCh60MHafmTlDbhFBl3yu/cUQruA37.', 'Dr. Eleanor Vance', 'warden@university.edu', '+1 (555) 019-2834', 'ROLE_WARDEN', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwfQuPj2ZlskBFeOtCqCInOeJdDLeYXRPR29TDK54xCx19QykDHGp2k4LljWsTnQ8EMb7dMBr9IKc6k12_1kWR9vsAJqRFI4UndWy_KAbSkmjLMpHpardYsFh8nSMM25Rdc04F7CQFGApKzxJxLCgKWZ6HZykYpZeSJ9wKKMcOhclTpUGmnMQdf2nrgemJWgEkbEcZRSnkZa3F6QplYhtCMl5ekWurCPHo_iB4qsDYv5UeGzRy6RHiEw', 'Student Affairs', 'Block Alpha & Bravo', true),
('STU-2024-089', '$2a$10$lKb4wot.KEzR2LSDEVMky.NCh60MHafmTlDbhFBl3yu/cUQruA37.', 'Aarav Sharma', 'aarav.sharma@campus.edu', '+1 (555) 349-8201', 'ROLE_STUDENT', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuy0qw-a0fz4Lnt1ykfAmA0PESEuJsfJvjf9ieSQgb59EaFW4iFX5vDpNbrimJCNiirvjU8mGBfSyyn0XAv0WUoi7rUbyreBRbOsn1uDWFrWnlTZUyeobYMeVKn3IdawuA0VCjcnIRwDmYx3RDerJ9fUu-fnE63tQf3SGXfOxiEN2wLqglWADJMMoG-8Vk-y3WpAiiFi8zA8QWi5k8LAfZqyNTgqMz5qIX50-sYfPsSHkVrJ7L7vhnMQ', 'B.Tech Computer Science', 'Wing B', true),
('STU-2024-112', '$2a$10$lKb4wot.KEzR2LSDEVMky.NCh60MHafmTlDbhFBl3yu/cUQruA37.', 'Marcus Chen', 'marcus.chen@campus.edu', '+1 (555) 891-4420', 'ROLE_STUDENT', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop', 'Electrical Engineering', 'Wing B', true),
('STU-2024-205', '$2a$10$lKb4wot.KEzR2LSDEVMky.NCh60MHafmTlDbhFBl3yu/cUQruA37.', 'Devon Bailey', 'devon.bailey@campus.edu', '+1 (555) 234-9988', 'ROLE_STUDENT', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop', 'Mechanical Engineering', 'Wing B', true),
('STU-2024-340', '$2a$10$lKb4wot.KEzR2LSDEVMky.NCh60MHafmTlDbhFBl3yu/cUQruA37.', 'Liam O''Connor', 'liam.oc@campus.edu', '+1 (555) 772-1092', 'ROLE_STUDENT', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop', 'Civil Engineering', 'Wing A', true);

-- 2. Seed Rooms
INSERT INTO rooms (room_number, wing, floor, room_type, capacity, occupied_beds, monthly_rent, status)
VALUES
('Room 204', 'Wing B', 2, 'Triple AC', 3, 2, 1450.00, 'PARTIALLY_OCCUPIED'),
('Room 205', 'Wing B', 2, 'Triple AC', 3, 3, 1450.00, 'FULL'),
('Room 101', 'Wing A', 1, 'Double Deluxe', 2, 1, 1600.00, 'PARTIALLY_OCCUPIED'),
('Room 102', 'Wing A', 1, 'Double Deluxe', 2, 0, 1600.00, 'AVAILABLE'),
('Room 310', 'Wing B', 3, 'Triple AC', 3, 1, 1400.00, 'PARTIALLY_OCCUPIED'),
('Room 311', 'Wing B', 3, 'Single Executive', 1, 1, 2100.00, 'FULL'),
('Room 401', 'Wing C', 4, 'Double Standard', 2, 0, 1100.00, 'MAINTENANCE'),
('Room 402', 'Wing C', 4, 'Double Standard', 2, 0, 1100.00, 'AVAILABLE');

-- 3. Seed Students
INSERT INTO students (user_id, roll_number, full_name, email, phone, room_id, bed_number, department, academic_year, guardian_name, guardian_phone, attendance_rate, fee_status, status, avatar_url)
VALUES
(2, 'STU-2024-089', 'Aarav Sharma', 'aarav.sharma@campus.edu', '+1 (555) 349-8201', 1, 'Bed A', 'B.Tech CS', '3rd Yr', 'Rajesh Sharma', '+1 (555) 901-2234', 96.20, 'PAID', 'ACTIVE', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuy0qw-a0fz4Lnt1ykfAmA0PESEuJsfJvjf9ieSQgb59EaFW4iFX5vDpNbrimJCNiirvjU8mGBfSyyn0XAv0WUoi7rUbyreBRbOsn1uDWFrWnlTZUyeobYMeVKn3IdawuA0VCjcnIRwDmYx3RDerJ9fUu-fnE63tQf3SGXfOxiEN2wLqglWADJMMoG-8Vk-y3WpAiiFi8zA8QWi5k8LAfZqyNTgqMz5qIX50-sYfPsSHkVrJ7L7vhnMQ'),
(3, 'STU-2024-112', 'Marcus Chen', 'marcus.chen@campus.edu', '+1 (555) 891-4420', 1, 'Bed B', 'EE', '3rd Yr', 'Wei Chen', '+1 (555) 441-2099', 91.50, 'PAID', 'ACTIVE', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop'),
(4, 'STU-2024-205', 'Devon Bailey', 'devon.bailey@campus.edu', '+1 (555) 234-9988', 2, 'Bed A', 'Mech Eng', '2nd Yr', 'Sarah Bailey', '+1 (555) 881-0021', 68.00, 'OVERDUE', 'ACTIVE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop'),
(5, 'STU-2024-340', 'Liam O''Connor', 'liam.oc@campus.edu', '+1 (555) 772-1092', 3, 'Bed A', 'Civil Eng', '4th Yr', 'Sean O''Connor', '+1 (555) 332-9011', 88.40, 'PENDING', 'ACTIVE', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop');

-- 4. Seed Attendance Records (Today)
INSERT INTO attendance_records (student_id, record_date, status, check_in_time, remarks, marked_by_user_id)
VALUES
(1, CURRENT_DATE, 'PRESENT', '21:30', 'Biometric scan verified at North Gate', 1),
(2, CURRENT_DATE, 'PRESENT', '21:45', 'Card swipe East Turnstile', 1),
(3, CURRENT_DATE, 'LATE', '22:15', 'Late return from project lab, signed curfew log', 1),
(4, CURRENT_DATE, 'LEAVE', NULL, 'Weekend home pass approved by Warden', 1);

-- 5. Seed Complaints
INSERT INTO complaints (ticket_number, student_id, room_id, title, description, category, priority, status, assigned_staff, resolution_notes)
VALUES
('CMP-1082', 1, 1, 'Bathroom Pipe Leakage & Water Pressure', 'The main cold water valve beneath the sink is vibrating and leaking steadily. Water pressure drops completely during morning peak hours.', 'Plumbing', 'HIGH', 'IN_PROGRESS', 'David Miller (Facilities Lead)', 'Replacement gasket ordered. Plumber arriving at 10 AM.'),
('CMP-1079', 2, 1, 'Ceiling Fan Regulator Malfunction', 'Speed regulator stays locked on max speed, sparks noticed during night shutoff.', 'Electrical', 'MEDIUM', 'OPEN', 'Tech Services', 'Scheduled for review.'),
('CMP-1074', 3, 2, 'AC Thermostat Erratic Temperature Fluctuation', 'Unit randomly cuts off and blows warm air every 20 minutes.', 'Electrical', 'HIGH', 'IN_PROGRESS', 'HVAC Team', 'Compressor inspected, filter cleaned.'),
('CMP-1065', 4, 3, 'Study Table Drawer Roller Rail Detached', 'Drawer fell off tracks and cannot be pushed back into desk frame.', 'Carpentry', 'LOW', 'RESOLVED', 'Sam Jenkins', 'Rails replaced with reinforced brackets.');

-- 6. Seed Fee Invoices
INSERT INTO fee_invoices (invoice_number, student_id, fee_type, term_name, amount, due_date, paid_date, status, transaction_ref, payment_mode)
VALUES
('INV-2024-889', 1, 'Hostel Term Fee', 'Fall 2024', 1450.00, '2024-10-15', '2024-10-10', 'PAID', 'TXN-9988231', 'UPI'),
('INV-2024-890', 2, 'Hostel Term Fee', 'Fall 2024', 1450.00, '2024-10-15', '2024-10-12', 'PAID', 'TXN-7762100', 'Bank Transfer'),
('INV-2024-912', 3, 'Hostel Term Fee', 'Fall 2024', 1450.00, '2024-09-30', NULL, 'OVERDUE', NULL, NULL),
('INV-2024-913', 3, 'Mess & Dining Fee', 'Fall 2024', 650.00, '2024-09-30', NULL, 'OVERDUE', NULL, NULL),
('INV-2024-940', 4, 'Hostel Term Fee', 'Fall 2024', 1600.00, '2024-11-01', NULL, 'PENDING', NULL, NULL);
