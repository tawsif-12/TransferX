-- Bashundhara Kings Squad Insertion Script
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

-- Ensure Bashundhara Kings club exists
IF NOT EXISTS (SELECT 1 FROM [Club] WHERE name = 'Bashundhara Kings')
BEGIN
    INSERT INTO [Club] (league_id, name, country, founded_year)
    VALUES (@leagueId, 'Bashundhara Kings', 'Bangladesh', 2013)
END

-- Get the club ID
DECLARE @clubId INT
SELECT @clubId = club_id FROM [Club] WHERE name = 'Bashundhara Kings'

-- Insert Players
-- GOALKEEPERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Anisur Rahman', 'Zico', '1997-08-10', 'GOALKEEPER', 'Bangladesh', @clubId, 125000),
    ('Mehedi Hasan', 'Srabon', '2005-08-12', 'GOALKEEPER', 'Bangladesh', @clubId, 50000),
    ('Mehedi', 'Hasan', '2004-01-02', 'GOALKEEPER', 'Bangladesh', @clubId, 10000),
    ('Shahin', 'Mollah', '2005-01-05', 'GOALKEEPER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- DEFENDERS - Centre-Back & Full-Backs
MERGE INTO [Player] AS target
USING (VALUES 
    ('Aksh', 'Ali', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 0),
    ('Topu', 'Barman', '1994-12-20', 'DEFENDER', 'Bangladesh', @clubId, 100000),
    ('Tanvir', 'Hossain', '2003-12-13', 'DEFENDER', 'Bangladesh', @clubId, 100000),
    ('Emmanuel Tony', 'Agbaji', '1992-11-21', 'DEFENDER', 'Nigeria', @clubId, 75000),
    ('Md Yousuf', 'Ali', '2007-08-10', 'DEFENDER', 'Bangladesh', @clubId, 50000),
    ('Saad', 'Uddin', '1998-09-01', 'DEFENDER', 'Bangladesh', @clubId, 150000),
    ('Md Rimon', 'Hossain', '2005-07-01', 'DEFENDER', 'Bangladesh', @clubId, 75000),
    ('Md Taj', 'Uddin', '2002-07-18', 'DEFENDER', 'Bangladesh', @clubId, 225000),
    ('Bishwanath', 'Ghosh', '1999-05-30', 'DEFENDER', 'Bangladesh', @clubId, 50000),
    ('Jahid', 'Hossain', '2002-08-15', 'DEFENDER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- MIDFIELDERS - Defensive & Central
MERGE INTO [Player] AS target
USING (VALUES 
    ('Mohammad', 'Ridoy', '2002-01-01', 'MIDFIELDER', 'Bangladesh', @clubId, 250000),
    ('Md Sohel', 'Rana', '1996-06-01', 'MIDFIELDER', 'Bangladesh', @clubId, 225000),
    ('Sohel', 'Rana', '1995-03-27', 'MIDFIELDER', 'Bangladesh', @clubId, 175000),
    ('Raphael', 'Augusto', '1991-03-06', 'MIDFIELDER', 'Brazil', @clubId, 150000),
    ('Chandon', 'Roy', '2007-05-04', 'MIDFIELDER', 'Bangladesh', @clubId, 75000),
    ('Mojibur Rahman', 'Jony', '2005-06-02', 'MIDFIELDER', 'Bangladesh', @clubId, 75000),
    ('Md Sabbir', 'Hossen', '2003-06-28', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Akmol Hossain', 'Noyon', '2005-08-07', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Samuel', 'Raksam', '2007-11-10', 'MIDFIELDER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- ATTACKING MIDFIELDERS & WINGERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Using', 'Marma', '2007-06-15', 'FORWARD', 'Bangladesh', @clubId, 0),
    ('Foysal Ahmed', 'Fahim', '2002-02-24', 'FORWARD', 'Bangladesh', @clubId, 200000),
    ('Rakib', 'Hossain', '1998-11-18', 'FORWARD', 'Bangladesh', @clubId, 250000),
    ('Shahriar', 'Emon', '2001-03-07', 'FORWARD', 'Bangladesh', @clubId, 150000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- FORWARDS/STRIKERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Emmanuel', 'Sunday', '1992-02-25', 'FORWARD', 'Nigeria', @clubId, 150000),
    ('Dorielton', '', '1990-03-07', 'FORWARD', 'Brazil', @clubId, 125000),
    ('Nabib Newaj', 'Jibon', '1990-08-17', 'FORWARD', 'Bangladesh', @clubId, 25000),
    ('Abu Sufian Yousuf', 'Sifat', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 10000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- Display summary
PRINT 'Bashundhara Kings Squad Summary:';
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
PRINT 'Bashundhara Kings squad has been successfully populated!'
