-- Mohammedan SC (Dhaka) Squad Insertion Script
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

-- Ensure Mohammedan SC (Dhaka) club exists
IF NOT EXISTS (SELECT 1 FROM [Club] WHERE name = 'Mohammedan SC (Dhaka)')
BEGIN
    INSERT INTO [Club] (league_id, name, country, founded_year)
    VALUES (@leagueId, 'Mohammedan SC (Dhaka)', 'Bangladesh', 1936)
END

-- Get the club ID
DECLARE @clubId INT
SELECT @clubId = club_id FROM [Club] WHERE name = 'Mohammedan SC (Dhaka)'

-- Insert Players
-- GOALKEEPERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Sujon', 'Hossain', '1996-08-05', 'GOALKEEPER', 'Bangladesh', @clubId, 175000),
    ('Shakib Al', 'Hasan', '2004-11-11', 'GOALKEEPER', 'Bangladesh', @clubId, 25000),
    ('Tayeb', 'Siddique', '1995-01-01', 'GOALKEEPER', 'Bangladesh', @clubId, 10000),
    ('Md Ismail Hossain', 'Mahin', '2007-10-28', 'GOALKEEPER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- DEFENDERS - Centre-Back
MERGE INTO [Player] AS target
USING (VALUES 
    ('Mehedi', 'Hasan', '1994-10-24', 'DEFENDER', 'Bangladesh', @clubId, 150000),
    ('Shakil Ahad', 'Topu', '2006-04-06', 'DEFENDER', 'Bangladesh', @clubId, 100000),
    ('Md Jahid', 'Hasan', '2003-06-01', 'DEFENDER', 'Bangladesh', @clubId, 75000),
    ('Emmanuel Eli', 'Keke', '1995-10-10', 'DEFENDER', 'Ghana', @clubId, 75000),
    ('Rajib', 'Hossain', '2005-03-10', 'DEFENDER', 'Bangladesh', @clubId, 25000),
    ('Mobin Ur', 'Rashid', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- DEFENDERS - Full-Backs
MERGE INTO [Player] AS target
USING (VALUES 
    ('Mahbub', 'Alam', '1996-06-22', 'DEFENDER', 'Bangladesh', @clubId, 50000),
    ('Joynal Abedin', 'Dipu', '2001-12-12', 'DEFENDER', 'Bangladesh', @clubId, 25000),
    ('Azizul Haque', 'Ananto', '2005-07-19', 'DEFENDER', 'Bangladesh', @clubId, 0),
    ('Rahmat', 'Mia', '1999-12-08', 'DEFENDER', 'Bangladesh', @clubId, 175000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- MIDFIELDERS - Defensive & Central
MERGE INTO [Player] AS target
USING (VALUES 
    ('Minhazul Abedin', 'Ballu', '2001-09-16', 'MIDFIELDER', 'Bangladesh', @clubId, 150000),
    ('Safiul', 'Hossain', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 25000),
    ('Ashraful Haque', 'Asif', '2005-06-05', 'MIDFIELDER', 'Bangladesh', @clubId, 25000),
    ('Sanowar', 'Hossain', '2003-04-01', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Nijam Uddin', 'Raju', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Md Mehedi', 'Hasan', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Hafizur Rahman', 'Babu', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Muzaffar', 'Muzaffarov', '1995-04-12', 'MIDFIELDER', 'Uzbekistan', @clubId, 250000),
    ('Md', 'Jewel', '1995-02-10', 'MIDFIELDER', 'Bangladesh', @clubId, 50000),
    ('Alamgir Kabir', 'Rana', '1990-06-07', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Hasibur Rohman', 'Rohit', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- WINGERS & FORWARDS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Arif', 'Hossain', '2001-12-31', 'FORWARD', 'Bangladesh', @clubId, 125000),
    ('Rahim', 'Uddin', '1999-06-03', 'FORWARD', 'Bangladesh', @clubId, 100000),
    ('Raju', 'Ahmed', '2005-02-10', 'FORWARD', 'Bangladesh', @clubId, 25000),
    ('Bernard', 'Morrison', '1993-05-20', 'FORWARD', 'Ghana', @clubId, 25000),
    ('Md Joy', 'Ahamed', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 10000),
    ('Samuel', 'Boateng', '1997-11-12', 'FORWARD', 'Ghana', @clubId, 175000),
    ('Sumon', 'Reza', '1995-06-15', 'FORWARD', 'Bangladesh', @clubId, 50000),
    ('Sourav', 'Dewan', '1998-06-15', 'FORWARD', 'Bangladesh', @clubId, 25000),
    ('Rafayel', 'Tudu', '2001-03-07', 'FORWARD', 'Bangladesh', @clubId, 25000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- Display summary
PRINT 'Mohammedan SC (Dhaka) Squad Summary:';
SELECT @clubId AS 'Club ID', COUNT(*) AS 'Total Players' FROM [Player] WHERE current_club_id = @clubId;
PRINT '';
PRINT 'Players by Position:';
SELECT 
    position,
    COUNT(*) AS count
FROM [Player]
WHERE current_club_id = @clubId
GROUP BY position
ORDER BY position;

PRINT '';
PRINT 'Mohammedan SC (Dhaka) squad has been successfully populated!'
