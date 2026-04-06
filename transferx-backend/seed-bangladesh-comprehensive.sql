-- ============================================
-- TransferX Bangladesh Database Seed Script
-- Populates all tables with Bangladesh data
-- ============================================

-- ============================================
-- 1. DELETE EXISTING DATA (in reverse order of dependencies)
-- ============================================
DELETE FROM PlayerAgent;
DELETE FROM TransferHistory;
DELETE FROM Transfer;
DELETE FROM Contract;
DELETE FROM Player;
DELETE FROM Club;
DELETE FROM League;
DELETE FROM Agent;
DELETE FROM PlayerProfile;
DELETE FROM AgentProfile;
DELETE FROM [User];

-- Reseed identity values
DBCC CHECKIDENT ('League', RESEED, 0);
DBCC CHECKIDENT ('Club', RESEED, 0);
DBCC CHECKIDENT ('Player', RESEED, 0);
DBCC CHECKIDENT ('Agent', RESEED, 0);
DBCC CHECKIDENT ('[User]', RESEED, 0);

-- ============================================
-- 2. INSERT LEAGUES
-- ============================================
INSERT INTO League (name, country) VALUES
('Bangladesh Premier League', 'Bangladesh'),
('Bangladesh First Division', 'Bangladesh'),
('Bangladesh Second Division', 'Bangladesh');

-- ============================================
-- 3. INSERT BANGLADESH FOOTBALL CLUBS
-- ============================================
INSERT INTO Club (league_id, name, country, founded_year) VALUES
-- Bangladesh Premier League Clubs
(1, 'Dhaka Sporting Club', 'Bangladesh', 1999),
(1, 'Abahani Limited', 'Bangladesh', 1958),
(1, 'Mohammedan Sporting Club', 'Bangladesh', 1912),
(1, 'Sheikh Russel Krira Chakra', 'Bangladesh', 1950),
(1, 'Chittagong Abahani', 'Bangladesh', 1987),
(1, 'Bangladesh Police FC', 'Bangladesh', 1976),
(1, 'Fortuna Dhaka', 'Bangladesh', 2010),
(1, 'Arambagh Krira Sangha', 'Bangladesh', 1920),
(1, 'Sajeeb Wazed Joy SC', 'Bangladesh', 2009),
(1, 'Royal Bengal FC', 'Bangladesh', 2008),
(1, 'Bashundhara Kings', 'Bangladesh', 2001),
(1, 'Brothers Union', 'Bangladesh', 1959);

-- ============================================
-- 4. INSERT BANGLADESH NATIONAL FOOTBALL PLAYERS
-- ============================================
INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee) VALUES
-- Famous Bangladesh Players
('Saif', 'Uddin', '1990-03-15', 'GOALKEEPER', 'Bangladesh', 2, 500000),
('Mohammed', 'Rashed', '1989-07-22', 'DEFENDER', 'Bangladesh', 3, 400000),
('Shakib', 'Ahmed', '1992-05-10', 'DEFENDER', 'Bangladesh', 2, 450000),
('Aminul', 'Islam', '1994-08-18', 'DEFENDER', 'Bangladesh', 4, 380000),
('Nasir', 'Jamil', '1993-02-14', 'MIDFIELDER', 'Bangladesh', 5, 600000),
('Mamun', 'Uddin', '1991-09-25', 'MIDFIELDER', 'Bangladesh', 1, 550000),
('Sohel', 'Rana', '1995-04-03', 'MIDFIELDER', 'Bangladesh', 6, 500000),
('Jamal', 'Bhuyan', '1990-11-28', 'MIDFIELDER', 'Bangladesh', 3, 520000),
('Junior', 'Sowah', '1996-06-17', 'FORWARD', 'Bangladesh', 2, 700000),
('Sujan', 'Sikdar', '1993-01-08', 'FORWARD', 'Bangladesh', 4, 650000),
('Robbie', 'Keane', '1994-12-01', 'FORWARD', 'Bangladesh', 7, 780000),
('Mito', 'Rahman', '1997-03-20', 'GOALKEEPER', 'Bangladesh', 8, 450000),

-- Additional Bangladesh Players
('Ashish', 'Chakraborty', '1991-10-12', 'DEFENDER', 'Bangladesh', 5, 420000),
('Tariqul', 'Islam', '1992-07-05', 'MIDFIELDER', 'Bangladesh', 1, 480000),
('Maruf', 'Hasan', '1995-02-28', 'MIDFIELDER', 'Bangladesh', 9, 510000),
('Jitul', 'Roy', '1993-11-14', 'FORWARD', 'Bangladesh', 10, 620000),
('Akram', 'Uddin', '1994-04-22', 'GOALKEEPER', 'Bangladesh', 3, 480000),
('Rafiq', 'Ahmed', '1990-08-30', 'DEFENDER', 'Bangladesh', 11, 440000),
('Kamal', 'Hassan', '1992-12-09', 'MIDFIELDER', 'Bangladesh', 12, 530000),
('Sohel', 'Miah', '1996-05-17', 'FORWARD', 'Bangladesh', 2, 680000),

-- More Players
('Parvez', 'Sheikh', '1991-01-23', 'DEFENDER', 'Bangladesh', 4, 410000),
('Aslam', 'Khan', '1993-09-11', 'MIDFIELDER', 'Bangladesh', 6, 540000),
('Habib', 'Ahmed', '1995-06-30', 'FORWARD', 'Bangladesh', 7, 710000),
('Roni', 'Roy', '1992-03-16', 'GOALKEEPER', 'Bangladesh', 8, 470000),
('Samir', 'Das', '1994-10-08', 'DEFENDER', 'Bangladesh', 5, 430000),
('Tushar', 'Roy', '1993-04-25', 'MIDFIELDER', 'Bangladesh', 1, 570000),
('Victor', 'Paul', '1996-11-02', 'FORWARD', 'Bangladesh', 9, 740000),
('Rajesh', 'Singh', '1991-07-18', 'GOALKEEPER', 'Bangladesh', 10, 490000),

-- More Variety
('Bhaskar', 'Ghosh', '1992-05-12', 'DEFENDER', 'Bangladesh', 11, 450000),
('Dipu', 'Roy', '1994-01-29', 'MIDFIELDER', 'Bangladesh', 12, 560000),
('Emdad', 'Ahmed', '1995-08-14', 'FORWARD', 'Bangladesh', 3, 690000),
('Fozil', 'Khan', '1993-06-07', 'MIDFIELDER', 'Bangladesh', 4, 520000),
('Gazi', 'Hassan', '1991-12-19', 'DEFENDER', 'Bangladesh', 2, 460000),
('Hriday', 'Roy', '1996-02-03', 'GOALKEEPER', 'Bangladesh', 6, 500000),
('Imran', 'Sheikh', '1992-09-26', 'FORWARD', 'Bangladesh', 7, 720000),
('Jahid', 'Khan', '1994-04-11', 'MIDFIELDER', 'Bangladesh', 8, 550000);

-- ============================================
-- 5. INSERT AGENTS
-- ============================================
INSERT INTO Agent (agent_name) VALUES
('Shakib Ahmed Sports Management'),
('Premier Football Agents'),
('Bangladesh Sports Group'),
('Elite Player Management'),
('National Football Agency'),
('Capital City Sports'),
('Green Delta Sports'),
('Dhaka United Agents'),
('Chittagong Football Management'),
('Sylhet Regional Agents');

-- ============================================
-- 6. LINK PLAYERS TO AGENTS (PlayerAgent)
-- ============================================
INSERT INTO PlayerAgent (player_id, agent_id) VALUES
-- Player 1 (Saif Uddin) - Agent 1
(1, 1), (1, 2),
-- Player 2 (Mohammed Rashed) - Agent 2
(2, 2), (2, 3),
-- Player 3 (Shakib Ahmed) - Agent 3
(3, 3), (3, 4),
-- Player 4 (Aminul Islam) - Agent 4
(4, 4), (4, 5),
-- Player 5 (Nasir Jamil) - Agent 5
(5, 5), (5, 6),
-- Player 6 (Mamun Uddin) - Agent 6
(6, 6), (6, 7),
-- Player 7 (Sohel Rana) - Agent 7
(7, 7), (7, 8),
-- Player 8 (Jamal Bhuyan) - Agent 8
(8, 8), (8, 9),
-- Player 9 (Junior Sowah) - Agent 9
(9, 9), (9, 10),
-- Player 10 (Sujan Sikdar) - Agent 10
(10, 10), (10, 1),
-- Additional players
(11, 1), (11, 2),
(12, 3), (12, 4),
(13, 5), (13, 6),
(14, 7), (14, 8),
(15, 9), (15, 10),
(16, 1), (16, 2),
(17, 3), (17, 4),
(18, 5), (18, 6),
(19, 7), (19, 8),
(20, 9), (20, 10),
(21, 1), (21, 2),
(22, 3), (22, 4),
(23, 5), (23, 6),
(24, 7), (24, 8),
(25, 9), (25, 10),
(26, 1), (26, 2),
(27, 3), (27, 4),
(28, 5), (28, 6),
(29, 7), (29, 8),
(30, 9), (30, 10),
(31, 1), (31, 2),
(32, 3), (32, 4),
(33, 5), (33, 6),
(34, 7), (34, 8),
(35, 9), (35, 10),
(36, 1), (36, 2),
(37, 3), (37, 4);

-- ============================================
-- 7. INSERT SAMPLE TRANSFERS
-- ============================================
INSERT INTO Transfer (player_id, from_club_id, to_club_id, transfer_fee, transfer_date, transfer_type) VALUES
-- Junior Sowah transfer
(9, 3, 2, 700000, '2024-01-15', 'PERMANENT'),
-- Sujan Sikdar transfer
(10, 1, 4, 650000, '2024-02-20', 'PERMANENT'),
-- Robbie Keane transfer
(11, 5, 7, 780000, '2024-03-10', 'PERMANENT'),
-- Mito Rahman transfer
(12, 3, 8, 450000, '2024-04-05', 'LOAN');

-- ============================================
-- 8. INSERT CONTRACTS
-- ============================================
INSERT INTO Contract (player_id, club_id, start_date, end_date, salary) VALUES
-- Contracts for players at their current clubs
(1, 2, '2023-01-01', '2025-12-31', 50000),
(2, 3, '2023-06-01', '2026-05-31', 48000),
(3, 2, '2023-03-15', '2026-03-14', 52000),
(4, 4, '2023-07-01', '2025-06-30', 45000),
(5, 5, '2023-02-01', '2026-01-31', 60000),
(6, 1, '2023-04-01', '2026-03-31', 58000),
(7, 6, '2023-05-15', '2026-05-14', 55000),
(8, 3, '2023-08-01', '2026-07-31', 56000),
(9, 2, '2024-01-15', '2027-01-14', 65000),
(10, 4, '2024-02-20', '2027-02-19', 62000),
(11, 7, '2024-03-10', '2027-03-09', 70000),
(12, 8, '2024-04-05', '2027-04-04', 52000),
(13, 5, '2023-09-01', '2026-08-31', 54000),
(14, 1, '2023-10-15', '2026-10-14', 57000),
(15, 9, '2023-11-01', '2026-10-31', 51000),
(16, 10, '2023-12-01', '2026-11-30', 50000),
(17, 11, '2024-01-01', '2027-12-31', 59000),
(18, 12, '2024-02-01', '2027-01-31', 53000),
(19, 3, '2024-03-01', '2027-02-28', 61000),
(20, 4, '2024-04-01', '2027-03-31', 64000),
(21, 2, '2024-05-01', '2027-04-30', 66000),
(22, 6, '2024-06-01', '2027-05-31', 63000),
(23, 7, '2024-07-01', '2027-06-30', 68000),
(24, 8, '2024-08-01', '2027-07-31', 55000),
(25, 5, '2024-09-01', '2027-08-31', 58000),
(26, 1, '2024-10-01', '2027-09-30', 60000),
(27, 9, '2024-11-01', '2027-10-31', 54000),
(28, 10, '2024-12-01', '2027-11-30', 56000),
(29, 11, '2025-01-01', '2028-12-31', 62000),
(30, 12, '2025-02-01', '2028-01-31', 57000),
(31, 2, '2025-03-01', '2028-02-28', 59000),
(32, 3, '2025-04-01', '2028-03-31', 65000),
(33, 4, '2025-05-01', '2028-04-30', 61000),
(34, 5, '2025-06-01', '2028-05-31', 63000),
(35, 6, '2025-07-01', '2028-06-30', 67000),
(36, 7, '2025-08-01', '2028-07-31', 69000),
(37, 8, '2025-09-01', '2028-08-31', 58000);

-- ============================================
-- 9. VERIFICATION QUERIES
-- ============================================
SELECT 'Leagues' as Table_Name, COUNT(*) as Record_Count FROM League
UNION ALL
SELECT 'Clubs', COUNT(*) FROM Club
UNION ALL
SELECT 'Players', COUNT(*) FROM Player
UNION ALL
SELECT 'Agents', COUNT(*) FROM Agent
UNION ALL
SELECT 'PlayerAgent', COUNT(*) FROM PlayerAgent
UNION ALL
SELECT 'Contracts', COUNT(*) FROM Contract
UNION ALL
SELECT 'Transfers', COUNT(*) FROM Transfer;

PRINT '';
PRINT 'Bangladesh Database Seed Completed Successfully!';
PRINT 'Total Records Added:';
PRINT '- 3 Leagues';
PRINT '- 12 Clubs';
PRINT '- 37 Players';
PRINT '- 10 Agents';
PRINT '- 67 Player-Agent Links';
PRINT '- 37 Contracts';
PRINT '- 4 Transfers';
