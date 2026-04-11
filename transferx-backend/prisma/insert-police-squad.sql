-- Bangladesh Police FC Squad Insertion Script
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

-- Ensure Bangladesh Police FC club exists
IF NOT EXISTS (SELECT 1 FROM [Club] WHERE name = 'Bangladesh Police FC')
BEGIN
    INSERT INTO [Club] (league_id, name, country, founded_year)
    VALUES (@leagueId, 'Bangladesh Police FC', 'Bangladesh', 1976)
END

-- Get the club ID
DECLARE @clubId INT
SELECT @clubId = club_id FROM [Club] WHERE name = 'Bangladesh Police FC'

-- Insert Players
-- GOALKEEPERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Rakibul Hasan', 'Tushar', '1997-02-08', 'GOALKEEPER', 'Bangladesh', @clubId, 75000),
    ('Dinaj Hosen', 'Jubed', '1996-11-15', 'GOALKEEPER', 'Bangladesh', @clubId, 10000),
    ('Md', 'Asif', '2006-10-20', 'GOALKEEPER', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- DEFENDERS - Centre-Back & Full-Backs
MERGE INTO [Player] AS target
USING (VALUES 
    ('Rakib', 'Hossen', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 0),
    ('Danilo', 'Quipapá', '1994-02-21', 'DEFENDER', 'Brazil', @clubId, 150000),
    ('Joyonto Kumar', 'Roy', '1998-04-28', 'DEFENDER', 'Bangladesh', @clubId, 125000),
    ('Riyadul Hasan', 'Rafi', '1999-10-01', 'DEFENDER', 'Bangladesh', @clubId, 100000),
    ('Mohammad Sagor', 'Miah', '2005-02-04', 'DEFENDER', 'Bangladesh', @clubId, 50000),
    ('Sharif Uddin', 'Nirob', '1995-01-01', 'DEFENDER', 'Bangladesh', @clubId, 25000),
    ('Isa', 'Faysal', '1999-08-20', 'DEFENDER', 'Bangladesh', @clubId, 250000),
    ('Akibur', 'Rahman', '2000-12-10', 'DEFENDER', 'Bangladesh', @clubId, 25000),
    ('Sherub', 'Dorji', '2002-04-17', 'DEFENDER', 'Bhutan', @clubId, 25000),
    ('Ismail', 'Hossen', '2004-10-26', 'DEFENDER', 'Bangladesh', @clubId, 100000),
    ('Rabiul', 'Islam', '1997-06-15', 'DEFENDER', 'Bangladesh', @clubId, 10000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- MIDFIELDERS - Defensive & Central
MERGE INTO [Player] AS target
USING (VALUES 
    ('Foday', 'Darboe', '2003-03-09', 'MIDFIELDER', 'The Gambia', @clubId, 100000),
    ('Md Moinul Islam', 'Moin', '2005-02-18', 'MIDFIELDER', 'Bangladesh', @clubId, 25000),
    ('S.', 'Rahman', '2002-03-10', 'MIDFIELDER', 'Bangladesh', @clubId, 10000),
    ('Md Omar', 'Faruk', '2004-03-12', 'MIDFIELDER', 'Bangladesh', @clubId, 0),
    ('Shafiq', 'Kagimu', '1998-11-28', 'MIDFIELDER', 'Uganda', @clubId, 225000),
    ('Manik', 'Mollah', '1999-03-11', 'MIDFIELDER', 'Bangladesh', @clubId, 125000),
    ('Anik', 'Hossain', '1998-08-03', 'MIDFIELDER', 'Bangladesh', @clubId, 25000),
    ('Shamim', 'Ahmed', '1993-03-18', 'MIDFIELDER', 'Bangladesh', @clubId, 10000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- ATTACKING MIDFIELDERS & WINGERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Orgyen Wangchuk', 'Tshering', '1999-09-14', 'FORWARD', 'Bhutan', @clubId, 75000),
    ('Mohamed Sheikh', 'Bablu', '1997-11-27', 'FORWARD', 'Bangladesh', @clubId, 75000),
    ('Asadul Islam', 'Sakib', '2005-07-29', 'FORWARD', 'Bangladesh', @clubId, 50000),
    ('Rahul', 'Junior', '2006-12-30', 'FORWARD', 'Bangladesh', @clubId, 50000),
    ('Asharouf Jaman Khan', 'Opi', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 0),
    ('Sumon', 'Soren', '2007-06-11', 'FORWARD', 'Bangladesh', @clubId, 0),
    ('Ayush', 'Ghalan', '2004-02-21', 'FORWARD', 'Nepal', @clubId, 150000),
    ('Dipok', 'Roy', '2002-08-12', 'FORWARD', 'Bangladesh', @clubId, 125000)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- FORWARDS/STRIKERS
MERGE INTO [Player] AS target
USING (VALUES 
    ('Paulo', 'Henrique', '1991-03-30', 'FORWARD', 'Brazil', @clubId, 100000),
    ('Sarower Zaman', 'Nipu', '2000-06-05', 'FORWARD', 'Bangladesh', @clubId, 25000),
    ('Moses', 'Odo', '1993-12-11', 'FORWARD', 'Nigeria', @clubId, 0),
    ('Md Yamin', 'Rana', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 0),
    ('Md Sanowar', 'Hossain', '1995-01-01', 'FORWARD', 'Bangladesh', @clubId, 0)
) AS source (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
ON target.first_name = source.first_name AND target.last_name = source.last_name
WHEN NOT MATCHED THEN
    INSERT (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
    VALUES (source.first_name, source.last_name, CAST(source.date_of_birth AS DATE), source.position, source.nationality, source.current_club_id, source.fee);

-- Display summary
PRINT 'Bangladesh Police FC Squad Summary:';
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
PRINT 'Bangladesh Police FC squad has been successfully populated!'
