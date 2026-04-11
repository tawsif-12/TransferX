-- Fakirapool Young Men's Club Squad Insertion Script
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

-- Ensure Fakirapool Young Men's Club exists
IF NOT EXISTS (SELECT 1 FROM [Club] WHERE name = 'Fakirapool Young Men''s Club')
BEGIN
    INSERT INTO [Club] (league_id, name, country, founded_year)
    VALUES (@leagueId, 'Fakirapool Young Men''s Club', 'Bangladesh', 2005)
END

-- Get the club ID
DECLARE @clubId INT
SELECT @clubId = club_id FROM [Club] WHERE name = 'Fakirapool Young Men''s Club'

-- Insert Players
-- GOALKEEPERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Md Sanju', 'Ahamed', '1995-01-01', 'GOALKEEPER', 'Bangladesh', @clubId, 25000),
    ('Md Bappi', 'Hasan', '1995-01-01', 'GOALKEEPER', 'Bangladesh', @clubId, 10000),
    ('Mezbahul Haque', 'Zisan', '1995-01-01', 'GOALKEEPER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- DEFENDERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Raficul', 'Islam', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 50000),
    ('Amit', 'Hasan', '2001-01-01', 'DEFENDER', 'Bangladesh', @clubId, 25000),
    ('Tias', 'Das', '2002-01-01', 'DEFENDER', 'Bangladesh', @clubId, 25000),
    ('Pronoy Enosent', 'Marandi', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 25000),
    ('Dalim', 'Barman', '1996-01-01', 'DEFENDER', 'Bangladesh', @clubId, 10000),
    ('Yeasin', 'Mia', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 10000),
    ('Mohammad', 'Riyad', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 10000),
    ('Muhammad Salman', 'Farchi', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 0),
    ('Mohamed', 'Fofana', '1995-01-01', 'DEFENDER', 'Mali', @clubId, 25000),
    ('Nur Mohammad', 'Shimul', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- MIDFIELDERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Shihab', 'Mia', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 25000),
    ('Jahid', 'Hossain', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 25000),
    ('Sagor', 'Hossain', '2002-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Md Sabbir', 'Hossain', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Shiblal', 'Tudu', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Shanto', 'Tudu', '2002-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 50000),
    ('Mostafa', 'Kahraba', '1988-01-01', 'MIDFIELDER', 'Egypt', @clubId, 50000),
    ('Bishal', 'Das', '1992-01-01', 'FORWARD', 'Bangladesh', @clubId, 0),
    ('Faizan Bin', 'Afzal', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 0),
    ('Mohamed', 'Shadhin', '1998-01-01', 'FORWARD', 'Bangladesh', @clubId, 50000),
    ('Irfan', 'Hossain', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 50000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- FORWARDS/STRIKERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Mannaf', 'Rabby', '1996-01-01', 'FORWARD', 'Bangladesh', @clubId, 50000),
    ('Ben Ibrahim', 'Ouattara', '1996-01-01', 'FORWARD', 'Cote d''Ivoire', @clubId, 50000),
    ('Anik Hossain', 'Siam', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 10000),
    ('Mohammad Habib', 'Ullah', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 10000),
    ('Md Mahid', 'Sheikh', '2006-01-01', 'FORWARD', 'Bangladesh', @clubId, 10000),
    ('Louis Lasana', 'Beavogui', '1995-01-01', 'FORWARD', 'Guinea', @clubId, 0),
    ('Hossain Mohammed', 'Arian', '2006-01-01', 'FORWARD', 'Bangladesh', @clubId, 0),
    ('Tamim', 'Ahammed', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 0),
    ('Apon Chandra', 'Roy', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- Display summary
PRINT 'Fakirapool Young Men''s Club Squad Summary:';
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
PRINT 'Fakirapool Young Men''s Club squad has been successfully populated!'
