-- Fortis FC Squad Insertion Script
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

-- Ensure Fortis FC club exists
IF NOT EXISTS (SELECT 1 FROM [Club] WHERE name = 'Fortis FC')
BEGIN
    INSERT INTO [Club] (league_id, name, country, founded_year)
    VALUES (@leagueId, 'Fortis FC', 'Bangladesh', 2013)
END

-- Get the club ID
DECLARE @clubId INT
SELECT @clubId = club_id FROM [Club] WHERE name = 'Fortis FC'

-- Insert Players
-- GOALKEEPERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Sujan', 'Perera', '1992-07-18', 'GOALKEEPER', 'Sri Lanka', @clubId, 75000),
    ('Omar', 'Linkcon', '1997-01-25', 'GOALKEEPER', 'Bangladesh', @clubId, 0),
    ('Mohammad Nayeem', 'Mia', '1994-01-12', 'GOALKEEPER', 'Bangladesh', @clubId, 0),
    ('Md Mehedi Islam', 'Rabbani', '2007-02-12', 'GOALKEEPER', 'Bangladesh', @clubId, 0),
    ('Md Atick Hossain', 'Sourav', '1995-01-01', 'GOALKEEPER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- DEFENDERS - Centre-Back & Full-Backs
MERGE INTO [Player] AS target
USING (VALUES 
    ('Mominul', 'Fakir', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 0),
    ('Ananta', 'Tamang', '1998-01-14', 'DEFENDER', 'Nepal', @clubId, 175000),
    ('Monjurur', 'Rahman', '1996-05-09', 'DEFENDER', 'Bangladesh', @clubId, 125000),
    ('Kamacai Marma', 'Aky', '2005-07-12', 'DEFENDER', 'Bangladesh', @clubId, 10000),
    ('Md Mithu', 'Chowdhury', '2008-11-10', 'DEFENDER', 'Bangladesh', @clubId, 10000),
    ('Rasel', 'Hossain', '2003-12-20', 'DEFENDER', 'Bangladesh', @clubId, 10000),
    ('Md Emon Babu', 'Jibon', '2008-02-06', 'DEFENDER', 'Bangladesh', @clubId, 0),
    ('Abdullah', 'Omar', '1994-10-17', 'DEFENDER', 'Bangladesh', @clubId, 100000),
    ('Noyon', 'Mia', '1999-02-06', 'DEFENDER', 'Bangladesh', @clubId, 100000),
    ('Sani', 'Das', '2008-03-02', 'DEFENDER', 'Bangladesh', @clubId, 25000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- MIDFIELDERS - Defensive & Central
MERGE INTO [Player] AS target
USING (VALUES 
    ('Atiqur Rahman', 'Fahad', '1995-09-15', 'MIDFIELDER', 'Bangladesh', @clubId, 100000),
    ('Joy', 'Kumar', '2003-10-11', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Pa Omar', 'Babou', '1998-10-01', 'MIDFIELDER', 'The Gambia', @clubId, 150000),
    ('Shajjad', 'Hossain', '1995-01-18', 'MIDFIELDER', 'Bangladesh', @clubId, 75000),
    ('Farhad', 'Mona', '2002-07-24', 'MIDFIELDER', 'Bangladesh', @clubId, 75000),
    ('Shafiq Rahman', 'Tihim', '2008-10-12', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Mamunul', 'Mamun', '1988-12-12', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Essa', 'Jallow', '1995-01-01', 'MIDFIELDER', 'The Gambia', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- WINGERS & FORWARDS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Riaj', 'Uddin', '2002-04-05', 'FORWARD', 'Bangladesh', @clubId, 75000),
    ('Dawa', 'Tshering', '1998-08-21', 'FORWARD', 'Bhutan', @clubId, 25000),
    ('Borhan', 'Uddin', '2001-05-08', 'FORWARD', 'Bangladesh', @clubId, 0),
    ('Sajed Hasan', 'Jummon', '2004-01-05', 'FORWARD', 'Bangladesh', @clubId, 75000),
    ('Mursed', 'Ali', '2008-12-20', 'FORWARD', 'Bangladesh', @clubId, 25000),
    ('Onyekachi', 'Okafor', '1994-06-02', 'FORWARD', 'Nigeria', @clubId, 75000),
    ('Md Piash Ahmed', 'Nova', '2005-09-25', 'FORWARD', 'Bangladesh', @clubId, 25000),
    ('Sakib', 'Bepari', '2003-01-21', 'FORWARD', 'Bangladesh', @clubId, 25000),
    ('Shakhawat', 'Rony', '1991-10-08', 'FORWARD', 'Bangladesh', @clubId, 10000),
    ('Ariful Islam', 'Shanto', '1997-02-14', 'FORWARD', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- Display summary
PRINT 'Fortis FC Squad Summary:';
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
PRINT 'Fortis FC squad has been successfully populated!'
