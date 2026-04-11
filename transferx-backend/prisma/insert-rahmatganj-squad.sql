-- Rahmatganj MFS Squad Insertion Script
-- This script inserts all the squad players into the database

-- First, ensure Bangladesh Premier League exists
IF NOT EXISTS (SELECT 1 FROM [League] WHERE name = 'Bangladesh Premier League')
BEGIN
    INSERT INTO [League] (name, country)
    VALUES ('Bangladesh Premier League', 'Bangladesh')
END

-- Get the league ID
DECLARE @leagueId INT
SELECT @leagueId = league_id FROM [League] WHERE name = 'Bangladesh Premier League'

-- Ensure Rahmatganj MFS club exists
IF NOT EXISTS (SELECT 1 FROM [Club] WHERE name = 'Rahmatganj MFS')
BEGIN
    INSERT INTO [Club] (league_id, name, country, founded_year)
    VALUES (@leagueId, 'Rahmatganj MFS', 'Bangladesh', 1983)
END

-- Get the club ID
DECLARE @clubId INT
SELECT @clubId = club_id FROM [Club] WHERE name = 'Rahmatganj MFS'

-- Insert Players
-- GOALKEEPERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Mamun', 'Alif', '1991-04-15', 'GOALKEEPER', 'Bangladesh', @clubId, 25000),
    ('Ahsan', 'Habib', '1991-08-20', 'GOALKEEPER', 'Bangladesh', @clubId, 10000),
    ('Shimul', 'Kumar', '1996-03-10', 'GOALKEEPER', 'Bangladesh', @clubId, 0),
    ('Md Nahidul', 'Islam', '2009-01-01', 'GOALKEEPER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- DEFENDERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Alfaj', 'Miah', '2001-05-12', 'DEFENDER', 'Bangladesh', @clubId, 10000),
    ('Parvej', 'Ahmed', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 10000),
    ('Istekharul Alam', 'Shakil', '1995-08-05', 'DEFENDER', 'Bangladesh', @clubId, 100000),
    ('Abhishek', 'Limbu', '1998-02-14', 'DEFENDER', 'Nepal', @clubId, 75000),
    ('Andrews Kwadwo', 'Appau', '2000-06-22', 'DEFENDER', 'Ghana', @clubId, 25000),
    ('Ariful', 'Islam', '1992-01-10', 'DEFENDER', 'Bangladesh', @clubId, 0),
    ('Md Sifat', 'Sahariar', '2006-03-01', 'DEFENDER', 'Bangladesh', @clubId, 0),
    ('Rajon', 'Howladar', '2002-07-18', 'DEFENDER', 'Bangladesh', @clubId, 150000),
    ('Shahin Ahammad', 'Mia', '2003-09-12', 'DEFENDER', 'Bangladesh', @clubId, 125000),
    ('Mahamudul Hasan', 'Kiron', '2000-11-25', 'DEFENDER', 'Bangladesh', @clubId, 75000),
    ('Jayed', 'Ahmed', '2001-08-09', 'DEFENDER', 'Bangladesh', @clubId, 50000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- MIDFIELDERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Md', 'Sayde', '2001-11-09', 'MIDFIELDER', 'Bangladesh', @clubId, 125000),
    ('Mohammad Arafat', 'Hossain', '1994-06-20', 'MIDFIELDER', 'Bangladesh', @clubId, 50000),
    ('Md Sadik', 'Ahmed', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Md', 'Faizullah', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Md', 'Arabi', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Clement', 'Adu', '1995-05-15', 'MIDFIELDER', 'Ghana', @clubId, 75000),
    ('Md Rafiqul', 'Islam', '2002-08-28', 'MIDFIELDER', 'Bangladesh', @clubId, 25000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- FORWARDS
MERGE INTO [Player] AS target
USING (VALUES 
    ('King', 'Solomon', '1999-03-25', 'FORWARD', 'The Gambia', @clubId, 25000),
    ('Mehedi Hosson', 'Royel', '1998-02-18', 'FORWARD', 'Bangladesh', @clubId, 125000),
    ('Ernest', 'Boateng', '2000-08-10', 'FORWARD', 'Ghana', @clubId, 125000),
    ('Adama', 'Jammeh', '1999-10-20', 'FORWARD', 'The Gambia', @clubId, 25000),
    ('Md Jubayer', 'Ahmed', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 25000),
    ('Md', 'Munna', '1998-06-14', 'FORWARD', 'Bangladesh', @clubId, 25000),
    ('Samim Yasir', 'Juel', '1999-12-08', 'FORWARD', 'Bangladesh', @clubId, 10000),
    ('Mohammed Fahim Nur', 'Toha', '1999-05-10', 'FORWARD', 'Bangladesh', @clubId, 10000),
    ('Nihat Jaman', 'Ucchash', '2002-11-30', 'FORWARD', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- Summary
SELECT 
    c.club_id,
    c.name,
    COUNT(p.player_id) AS total_players
FROM Club c
LEFT JOIN Player p ON c.club_id = p.current_club_id
WHERE c.name = 'Rahmatganj MFS'
GROUP BY c.club_id, c.name;

-- Players by Position
SELECT 
    position,
    COUNT(*) AS count
FROM Player
WHERE current_club_id = @clubId
GROUP BY position
ORDER BY position;

PRINT 'Rahmatganj MFS squad has been successfully populated!';
