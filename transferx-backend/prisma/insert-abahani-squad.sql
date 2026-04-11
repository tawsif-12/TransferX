-- Abahani Limited Dhaka Squad Insertion Script
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

-- Ensure Abahani Limited Dhaka club exists
IF NOT EXISTS (SELECT 1 FROM [Club] WHERE name = 'Abahani Limited Dhaka')
BEGIN
    INSERT INTO [Club] (league_id, name, country, founded_year)
    VALUES (@leagueId, 'Abahani Limited Dhaka', 'Bangladesh', 1972)
END

-- Get the club ID
DECLARE @clubId INT
SELECT @clubId = club_id FROM [Club] WHERE name = 'Abahani Limited Dhaka'

-- Insert Players
-- GOALKEEPERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Mitul', 'Marma', '2003-12-11', 'GOALKEEPER', 'Bangladesh', @clubId, 200000),
    ('Sahidul', 'Alam', '1992-05-01', 'GOALKEEPER', 'Bangladesh', @clubId, 50000),
    ('Pappu', 'Hossain', '1999-04-07', 'GOALKEEPER', 'Bangladesh', @clubId, 25000),
    ('Mahfuz Hasan', 'Pritom', '1999-11-05', 'GOALKEEPER', 'Bangladesh', @clubId, 10000),
    ('Shamim', 'Hossen', '1998-11-01', 'GOALKEEPER', 'Bangladesh', @clubId, 10000),
    ('SP', 'Rafiz', '2007-11-21', 'GOALKEEPER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- DEFENDERS - Centre-Back & Full-Backs
MERGE INTO [Player] AS target
USING (VALUES 
    ('Shakir', 'Ahmed', '2002-02-04', 'DEFENDER', 'Bangladesh', @clubId, 10000),
    ('Sakil', 'Hossain', '2002-07-06', 'DEFENDER', 'Bangladesh', @clubId, 150000),
    ('Assaduzzaman', 'Bablu', '1996-01-01', 'DEFENDER', 'Bangladesh', @clubId, 150000),
    ('Hasan', 'Murad', '1998-01-02', 'DEFENDER', 'Bangladesh', @clubId, 125000),
    ('Yeasin', 'Khan', '1994-09-16', 'DEFENDER', 'Bangladesh', @clubId, 100000),
    ('Sabuz', 'Hossain', '2002-07-23', 'DEFENDER', 'Bangladesh', @clubId, 50000),
    ('Md Abdul Riyadh', 'Fahim', '2008-08-08', 'DEFENDER', 'Bangladesh', @clubId, 0),
    ('Kamrul', 'Islam', '1998-12-25', 'DEFENDER', 'Bangladesh', @clubId, 150000),
    ('Alomgir', 'Molla', '2000-11-06', 'DEFENDER', 'Bangladesh', @clubId, 125000),
    ('Sushanto', 'Tripura', '1998-10-05', 'DEFENDER', 'Bangladesh', @clubId, 175000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- MIDFIELDERS - Defensive, Central, and Attacking
MERGE INTO [Player] AS target
USING (VALUES 
    ('Papon', 'Singh', '1999-12-31', 'MIDFIELDER', 'Bangladesh', @clubId, 125000),
    ('Sayed Hossain', 'Sayem', '2002-02-07', 'MIDFIELDER', 'Bangladesh', @clubId, 25000),
    ('Iftiar', 'Hossain', '2006-10-24', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Quazem', 'Shah', '1998-10-25', 'MIDFIELDER', 'Canada', @clubId, 200000),
    ('Tonmoy', 'Das', '2000-05-01', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Shekh', 'Morsalin', '2005-11-25', 'MIDFIELDER', 'Bangladesh', @clubId, 150000),
    ('Bruno', 'Matos', '1990-06-05', 'MIDFIELDER', 'Brazil', @clubId, 50000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- WINGERS & FORWARDS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Md Enamul', 'Islam', '2001-10-12', 'FORWARD', 'Bangladesh', @clubId, 150000),
    ('Jafar', 'Iqbal', '1999-09-27', 'FORWARD', 'Bangladesh', @clubId, 125000),
    ('Mohammad', 'Ibrahim', '1997-08-07', 'FORWARD', 'Bangladesh', @clubId, 100000),
    ('Mirajul', 'Islam', '2006-10-01', 'FORWARD', 'Bangladesh', @clubId, 75000),
    ('Souleymane', 'Diabate', '1991-03-23', 'FORWARD', 'Mali', @clubId, 150000),
    ('Md Alamin', 'Islam', '2004-03-29', 'FORWARD', 'Bangladesh', @clubId, 100000),
    ('Emeka', 'Ogbugh', '1990-02-22', 'FORWARD', 'Nigeria', @clubId, 75000),
    ('Md Asadul', 'Molla', '2006-12-26', 'FORWARD', 'Bangladesh', @clubId, 50000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- Display summary
SELECT @clubId AS 'Club ID', COUNT(*) AS 'Total Players' FROM [Player] WHERE current_club_id = @clubId;
SELECT 
    position,
    COUNT(*) AS count
FROM [Player]
WHERE current_club_id = @clubId
GROUP BY position
ORDER BY position;

PRINT 'Abahani Limited Dhaka squad has been successfully populated!'
