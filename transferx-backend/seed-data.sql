-- ============================================
-- TRANSFERX DATABASE SEED DATA
-- ============================================

-- Truncate tables to clear old data
TRUNCATE TABLE [Transfer];
TRUNCATE TABLE [Contract];
TRUNCATE TABLE [PlayerAgent];
TRUNCATE TABLE [PlayerProfile];
TRUNCATE TABLE [AgentProfile];
TRUNCATE TABLE [Player];
TRUNCATE TABLE [Agent];
TRUNCATE TABLE [Club];
TRUNCATE TABLE [League];
TRUNCATE TABLE [User];

-- ============================================
-- LEAGUES
-- ============================================
INSERT INTO [League] (name, country)
VALUES 
  ('Premier League', 'England'),
  ('La Liga', 'Spain'),
  ('Serie A', 'Italy'),
  ('Bundesliga', 'Germany'),
  ('Ligue 1', 'France');

-- ============================================
-- CLUBS
-- ============================================
INSERT INTO [Club] (league_id, name, country, founded_year)
SELECT league_id, 'Manchester United', 'England', 1878 FROM League WHERE name = 'Premier League'
UNION ALL
SELECT league_id, 'Liverpool FC', 'England', 1892 FROM League WHERE name = 'Premier League'
UNION ALL
SELECT league_id, 'Manchester City', 'England', 1880 FROM League WHERE name = 'Premier League'
UNION ALL
SELECT league_id, 'Chelsea FC', 'England', 1905 FROM League WHERE name = 'Premier League'
UNION ALL
SELECT league_id, 'Arsenal FC', 'England', 1886 FROM League WHERE name = 'Premier League'
UNION ALL
SELECT league_id, 'Real Madrid', 'Spain', 1902 FROM League WHERE name = 'La Liga'
UNION ALL
SELECT league_id, 'FC Barcelona', 'Spain', 1899 FROM League WHERE name = 'La Liga'
UNION ALL
SELECT league_id, 'Atletico Madrid', 'Spain', 1903 FROM League WHERE name = 'La Liga'
UNION ALL
SELECT league_id, 'AC Milan', 'Italy', 1899 FROM League WHERE name = 'Serie A'
UNION ALL
SELECT league_id, 'Inter Milan', 'Italy', 1908 FROM League WHERE name = 'Serie A';

-- ============================================
-- AGENTS
-- ============================================
INSERT INTO [Agent] (agent_name)
VALUES 
  ('Jorge Mendes'),
  ('Mino Raiola'),
  ('Paul Stretford'),
  ('Carlo Insigne'),
  ('Pini Zahavi'),
  ('Nicolas Anelka'),
  ('Jonathan Barnett'),
  ('Kia Joorabchian');

-- ============================================
-- PLAYERS
-- ============================================
INSERT INTO [Player] (current_club_id, first_name, last_name, position, nationality, date_of_birth, fee)
SELECT TOP 1 club_id, 'Cristiano', 'Ronaldo', 'Forward', 'Portugal', '1985-02-05', 120.5 FROM Club WHERE name = 'Manchester United'
UNION ALL
SELECT TOP 1 club_id, 'Lionel', 'Messi', 'Forward', 'Argentina', '1987-06-24', 115.0 FROM Club WHERE name = 'Real Madrid'
UNION ALL
SELECT TOP 1 club_id, 'Erling', 'Haaland', 'Forward', 'Norway', '2000-07-21', 85.0 FROM Club WHERE name = 'Manchester City'
UNION ALL
SELECT TOP 1 club_id, 'Kylian', 'Mbappe', 'Forward', 'France', '1998-12-20', 180.0 FROM Club WHERE name = 'Liverpool FC'
UNION ALL
SELECT TOP 1 club_id, 'Robert', 'Lewandowski', 'Forward', 'Poland', '1988-08-21', 75.0 FROM Club WHERE name = 'Chelsea FC'
UNION ALL
SELECT TOP 1 club_id, 'Vinicius', 'Junior', 'Forward', 'Brazil', '2000-07-12', 90.0 FROM Club WHERE name = 'Arsenal FC'
UNION ALL
SELECT TOP 1 club_id, 'Lautaro', 'Martinez', 'Forward', 'Argentina', '1998-08-22', 85.0 FROM Club WHERE name = 'Manchester United'
UNION ALL
SELECT TOP 1 club_id, 'Gianluigi', 'Donnarumma', 'Goalkeeper', 'Italy', '1999-02-25', 60.0 FROM Club WHERE name = 'Liverpool FC'
UNION ALL
SELECT TOP 1 club_id, 'Florian', 'Wirtz', 'Midfielder', 'Germany', '2003-05-03', 95.0 FROM Club WHERE name = 'Chelsea FC'
UNION ALL
SELECT TOP 1 club_id, 'Jude', 'Bellingham', 'Midfielder', 'England', '2003-06-29', 120.0 FROM Club WHERE name = 'Manchester City'
UNION ALL
SELECT TOP 1 club_id, 'Eduardo', 'Camavinga', 'Midfielder', 'France', '2002-11-10', 70.0 FROM Club WHERE name = 'Arsenal FC'
UNION ALL
SELECT TOP 1 club_id, 'Nico', 'Williams', 'Midfielder', 'Spain', '2002-07-07', 65.0 FROM Club WHERE name = 'AC Milan'
UNION ALL
SELECT TOP 1 club_id, 'Bukayo', 'Saka', 'Forward', 'England', '2001-09-05', 65.0 FROM Club WHERE name = 'Inter Milan'
UNION ALL
SELECT TOP 1 club_id, 'Declan', 'Rice', 'Midfielder', 'England', '2001-01-14', 75.0 FROM Club WHERE name = 'AC Milan'
UNION ALL
SELECT TOP 1 club_id, 'Matteo', 'Kovacic', 'Midfielder', 'Croatia', '1994-05-06', 50.0 FROM Club WHERE name = 'Inter Milan';

-- ============================================
-- PLAYER AGENTS (Link players to agents)
-- ============================================
INSERT INTO [PlayerAgent] (player_id, agent_id)
SELECT p.player_id, a.agent_id FROM Player p, Agent a 
WHERE p.first_name = 'Cristiano' AND a.agent_name = 'Jorge Mendes'
UNION ALL
SELECT p.player_id, a.agent_id FROM Player p, Agent a 
WHERE p.first_name = 'Lionel' AND a.agent_name = 'Jorge Mendes'
UNION ALL
SELECT p.player_id, a.agent_id FROM Player p, Agent a 
WHERE p.first_name = 'Erling' AND a.agent_name = 'Mino Raiola'
UNION ALL
SELECT p.player_id, a.agent_id FROM Player p, Agent a 
WHERE p.first_name = 'Kylian' AND a.agent_name = 'Paul Stretford'
UNION ALL
SELECT p.player_id, a.agent_id FROM Player p, Agent a 
WHERE p.first_name = 'Robert' AND a.agent_name = 'Carlo Insigne'
UNION ALL
SELECT p.player_id, a.agent_id FROM Player p, Agent a 
WHERE p.first_name = 'Vinicius' AND a.agent_name = 'Pini Zahavi'
UNION ALL
SELECT p.player_id, a.agent_id FROM Player p, Agent a 
WHERE p.first_name = 'Lautaro' AND a.agent_name = 'Nicolas Anelka'
UNION ALL
SELECT p.player_id, a.agent_id FROM Player p, Agent a 
WHERE p.first_name = 'Gianluigi' AND a.agent_name = 'Jonathan Barnett'
UNION ALL
SELECT p.player_id, a.agent_id FROM Player p, Agent a 
WHERE p.first_name = 'Florian' AND a.agent_name = 'Kia Joorabchian'
UNION ALL
SELECT p.player_id, a.agent_id FROM Player p, Agent a 
WHERE p.first_name = 'Jude' AND a.agent_name = 'Jonathan Barnett'
UNION ALL
SELECT p.player_id, a.agent_id FROM Player p, Agent a 
WHERE p.first_name = 'Nico' AND a.agent_name = 'Paul Stretford'
UNION ALL
SELECT p.player_id, a.agent_id FROM Player p, Agent a 
WHERE p.first_name = 'Bukayo' AND a.agent_name = 'Carlo Insigne';

-- ============================================
-- CONTRACTS
-- ============================================
INSERT INTO [Contract] (player_id, club_id, start_date, end_date, salary)
SELECT p.player_id, p.current_club_id, '2023-01-01', '2026-12-31', 30000000 FROM Player p WHERE p.first_name = 'Cristiano'
UNION ALL
SELECT p.player_id, p.current_club_id, '2022-06-01', '2027-06-30', 50000000 FROM Player p WHERE p.first_name = 'Lionel'
UNION ALL
SELECT p.player_id, p.current_club_id, '2023-07-01', '2028-06-30', 35000000 FROM Player p WHERE p.first_name = 'Erling'
UNION ALL
SELECT p.player_id, p.current_club_id, '2023-05-01', '2027-05-31', 45000000 FROM Player p WHERE p.first_name = 'Kylian'
UNION ALL
SELECT p.player_id, p.current_club_id, '2023-02-01', '2026-12-31', 25000000 FROM Player p WHERE p.first_name = 'Robert'
UNION ALL
SELECT p.player_id, p.current_club_id, '2023-03-01', '2028-02-28', 28000000 FROM Player p WHERE p.first_name = 'Vinicius'
UNION ALL
SELECT p.player_id, p.current_club_id, '2023-04-01', '2027-03-31', 32000000 FROM Player p WHERE p.first_name = 'Lautaro'
UNION ALL
SELECT p.player_id, p.current_club_id, '2023-06-01', '2026-05-31', 22000000 FROM Player p WHERE p.first_name = 'Gianluigi'
UNION ALL
SELECT p.player_id, p.current_club_id, '2023-08-01', '2028-07-31', 18000000 FROM Player p WHERE p.first_name = 'Florian'
UNION ALL
SELECT p.player_id, p.current_club_id, '2023-07-01', '2029-06-30', 20000000 FROM Player p WHERE p.first_name = 'Jude';

-- ============================================
-- TRANSFERS
-- ============================================
INSERT INTO [Transfer] (player_id, from_club_id, to_club_id, transfer_date, transfer_fee, transfer_type)
SELECT 
  p.player_id,
  (SELECT club_id FROM Club WHERE name = 'Real Madrid'),
  (SELECT club_id FROM Club WHERE name = 'Manchester United'),
  '2023-09-01',
  120.5,
  'Transfer'
FROM Player p WHERE p.first_name = 'Cristiano'
UNION ALL
SELECT 
  p.player_id,
  (SELECT club_id FROM Club WHERE name = 'Manchester City'),
  (SELECT club_id FROM Club WHERE name = 'Liverpool FC'),
  '2023-08-15',
  180.0,
  'Transfer'
FROM Player p WHERE p.first_name = 'Kylian'
UNION ALL
SELECT 
  p.player_id,
  (SELECT club_id FROM Club WHERE name = 'Real Madrid'),
  (SELECT club_id FROM Club WHERE name = 'Arsenal FC'),
  '2023-07-20',
  90.0,
  'Transfer'
FROM Player p WHERE p.first_name = 'Vinicius'
UNION ALL
SELECT 
  p.player_id,
  (SELECT club_id FROM Club WHERE name = 'Chelsea FC'),
  (SELECT club_id FROM Club WHERE name = 'Manchester United'),
  '2023-06-10',
  85.0,
  'Transfer'
FROM Player p WHERE p.first_name = 'Lautaro'
UNION ALL
SELECT 
  p.player_id,
  (SELECT club_id FROM Club WHERE name = 'AC Milan'),
  (SELECT club_id FROM Club WHERE name = 'Chelsea FC'),
  '2023-05-05',
  70.0,
  'Transfer'
FROM Player p WHERE p.first_name = 'Eduardo';

-- ============================================
-- USERS (Test Accounts)
-- ============================================
INSERT INTO [User] (email, password, fullName, role)
VALUES
  ('admin@transferx.com', '$2a$10$YourHashedPasswordHere', 'Admin User', 'ADMIN'),
  ('player1@transferx.com', '$2a$10$YourHashedPasswordHere', 'John Smith', 'PLAYER'),
  ('player2@transferx.com', '$2a$10$YourHashedPasswordHere', 'Emma Wilson', 'PLAYER'),
  ('agent1@transferx.com', '$2a$10$YourHashedPasswordHere', 'Michael Brown', 'AGENT'),
  ('manager1@transferx.com', '$2a$10$YourHashedPasswordHere', 'David Johnson', 'CLUB_MANAGER'),
  ('manager2@transferx.com', '$2a$10$YourHashedPasswordHere', 'Sarah Davis', 'CLUB_MANAGER');

PRINT 'Database seed completed successfully!';
