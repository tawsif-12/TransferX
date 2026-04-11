-- Arambag Krira Sangha Squad Insertion Script
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

-- Ensure Arambag Krira Sangha club exists
IF NOT EXISTS (SELECT 1 FROM [Club] WHERE name = 'Arambag Krira Sangha')
BEGIN
    INSERT INTO [Club] (league_id, name, country, founded_year)
    VALUES (@leagueId, 'Arambag Krira Sangha', 'Bangladesh', 2010)
END

-- Get the club ID
DECLARE @clubId INT
SELECT @clubId = club_id FROM [Club] WHERE name = 'Arambag Krira Sangha'

-- Insert Players
-- GOALKEEPERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Azad', 'Hossain', '1992-01-01', 'GOALKEEPER', 'Bangladesh', @clubId, 25000),
    ('Mohiuddin', 'Ranu', '2002-01-01', 'GOALKEEPER', 'Bangladesh', @clubId, 10000),
    ('Md', 'Salim', '1988-01-01', 'GOALKEEPER', 'Bangladesh', @clubId, 10000),
    ('Md Tanvir', 'Ahamed', '1995-01-01', 'GOALKEEPER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- DEFENDERS - Centre-Back & Full-Backs
MERGE INTO [Player] AS target
USING (VALUES 
    ('Mohammed', 'Obaidullah', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 10000),
    ('Abu Taleb', 'Parvez', '2002-01-01', 'DEFENDER', 'Bangladesh', @clubId, 0),
    ('Ben', 'Quansah', '1995-01-01', 'DEFENDER', 'Ghana', @clubId, 75000),
    ('Kazi', 'Rahad', '2002-01-01', 'DEFENDER', 'Bangladesh', @clubId, 25000),
    ('Md Shakil', 'Ahmed', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 25000),
    ('Apurbo', 'Mali', '2004-01-01', 'DEFENDER', 'Bangladesh', @clubId, 0),
    ('Mohammad', 'Rocky', '1997-01-01', 'DEFENDER', 'Bangladesh', @clubId, 75000),
    ('Ariful Islam', 'Sakhawat', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 25000),
    ('Monir', 'Hossain', '1998-01-01', 'DEFENDER', 'Bangladesh', @clubId, 0),
    ('Sadekujaman', 'Fahim', '2001-01-01', 'DEFENDER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- MIDFIELDERS - Defensive & Central
MERGE INTO [Player] AS target
USING (VALUES 
    ('Shadrach Lantei', 'Mills', '1998-01-01', 'MIDFIELDER', 'Ghana', @clubId, 50000),
    ('Nikson Chakma', 'Mui', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 25000),
    ('Mahmudul Hasan', 'Ritu', '1996-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Samor', 'Tanchangya', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Mohamed', 'Rasel', '1986-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Najim', 'Shikdar', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Abdullah Junaid', 'Cishty', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Md Nazmul Ahmed', 'Shakil', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Azmol', 'Gazi', '1995-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Umor Faruq', 'Mithu', '2002-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 25000),
    ('Biplu', 'Ahmed', '1998-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Md Ratul', 'Hasan', '2007-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Didarul', 'Alam', '1994-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 50000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- ATTACKING MIDFIELDERS & WINGERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Shahidul', 'Islam', '2005-01-01', 'FORWARD', 'Bangladesh', @clubId, 100000),
    ('Amir Hakim', 'Bappy', '1997-01-01', 'FORWARD', 'Bangladesh', @clubId, 50000),
    ('Kawser Ali', 'Rabbi', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 50000),
    ('Khondoker Ashraful', 'Islam', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 25000),
    ('Arifur', 'Rahman', '1997-01-01', 'FORWARD', 'Bangladesh', @clubId, 10000),
    ('Morshedul', 'Islam', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 10000),
    ('Mohammed', 'Shawon', '1999-01-01', 'FORWARD', 'Bangladesh', @clubId, 0),
    ('Shakil', 'Ali', '2005-01-01', 'FORWARD', 'Bangladesh', @clubId, 10000),
    ('Shawon', 'Ritchil', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 10000),
    ('Kwame', 'Kizito', '1995-01-01', 'FORWARD', 'Ghana', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- Display summary
PRINT 'Arambag Krira Sangha Squad Summary:';
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
PRINT 'Arambag Krira Sangha squad has been successfully populated!'
