-- Seed Players Data for TransferX
-- This script inserts player data into the database

BEGIN TRY
    BEGIN TRANSACTION;

    -- Insert Leagues
    IF NOT EXISTS (SELECT 1 FROM League WHERE name = 'Bangladesh Premier League')
        INSERT INTO League (name, country) VALUES ('Bangladesh Premier League', 'Bangladesh');

    DECLARE @LeagueId INT = (SELECT league_id FROM League WHERE name = 'Bangladesh Premier League');

    -- Insert Clubs
    IF NOT EXISTS (SELECT 1 FROM Club WHERE name = 'Abahani Limited Dhaka')
        INSERT INTO Club (league_id, name, country, founded_year) VALUES (@LeagueId, 'Abahani Limited Dhaka', 'Bangladesh', 1936);

    IF NOT EXISTS (SELECT 1 FROM Club WHERE name = 'Mohammedan SC (Dhaka)')
        INSERT INTO Club (league_id, name, country, founded_year) VALUES (@LeagueId, 'Mohammedan SC (Dhaka)', 'Bangladesh', 1901);

    IF NOT EXISTS (SELECT 1 FROM Club WHERE name = 'Bashundhara Kings')
        INSERT INTO Club (league_id, name, country, founded_year) VALUES (@LeagueId, 'Bashundhara Kings', 'Bangladesh', 2011);

    IF NOT EXISTS (SELECT 1 FROM Club WHERE name = 'Without Club')
        INSERT INTO Club (league_id, name, country, founded_year) VALUES (@LeagueId, 'Without Club', 'Bangladesh', 2000);

    IF NOT EXISTS (SELECT 1 FROM Club WHERE name = 'Fortis FC')
        INSERT INTO Club (league_id, name, country, founded_year) VALUES (@LeagueId, 'Fortis FC', 'Bangladesh', 2015);

    IF NOT EXISTS (SELECT 1 FROM Club WHERE name = 'Rimal Al-Sahra SC')
        INSERT INTO Club (league_id, name, country, founded_year) VALUES (@LeagueId, 'Rimal Al-Sahra SC', 'Saudi Arabia', 2010);

    IF NOT EXISTS (SELECT 1 FROM Club WHERE name = 'Leicester City')
        INSERT INTO Club (league_id, name, country, founded_year) VALUES (@LeagueId, 'Leicester City', 'England', 1884);

    IF NOT EXISTS (SELECT 1 FROM Club WHERE name = 'Brothers Union')
        INSERT INTO Club (league_id, name, country, founded_year) VALUES (@LeagueId, 'Brothers Union', 'Bangladesh', 2010);

    IF NOT EXISTS (SELECT 1 FROM Club WHERE name = 'PWD SC (Dhaka)')
        INSERT INTO Club (league_id, name, country, founded_year) VALUES (@LeagueId, 'PWD SC (Dhaka)', 'Bangladesh', 1950);

    IF NOT EXISTS (SELECT 1 FROM Club WHERE name = 'Olbia Calcio 1905')
        INSERT INTO Club (league_id, name, country, founded_year) VALUES (@LeagueId, 'Olbia Calcio 1905', 'Italy', 1905);

    -- Insert Players (Goalkeepers)
    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Mitul' AND last_name = 'Marma')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Mitul', 'Marma', DATEFROMPARTS(2002, 1, 1), 'Goalkeeper', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Abahani Limited Dhaka'), 200000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Sujon' AND last_name = 'Hossain')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Sujon', 'Hossain', DATEFROMPARTS(1995, 1, 1), 'Goalkeeper', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Mohammedan SC (Dhaka)'), 175000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Mehedi' AND last_name = 'Hasan Srabon')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Mehedi', 'Hasan Srabon', DATEFROMPARTS(2004, 1, 1), 'Goalkeeper', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Bashundhara Kings'), 50000);

    -- Insert Players (Defenders)
    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Tariq' AND last_name = 'Kazi')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Tariq', 'Kazi', DATEFROMPARTS(1999, 1, 1), 'Centre-Back', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Without Club'), 125000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Shakil' AND last_name = 'Ahad Topu')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Shakil', 'Ahad Topu', DATEFROMPARTS(2005, 1, 1), 'Centre-Back', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Mohammedan SC (Dhaka)'), 100000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Saad' AND last_name = 'Uddin')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Saad', 'Uddin', DATEFROMPARTS(1997, 1, 1), 'Left-Back', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Bashundhara Kings'), 150000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Abdullah' AND last_name = 'Omar')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Abdullah', 'Omar', DATEFROMPARTS(1993, 1, 1), 'Left-Back', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Fortis FC'), 100000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Zayyan' AND last_name = 'Ahmed')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Zayyan', 'Ahmed', DATEFROMPARTS(2002, 1, 1), 'Left-Back', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Rimal Al-Sahra SC'), 50000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Rahmat' AND last_name = 'Mia')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Rahmat', 'Mia', DATEFROMPARTS(1998, 1, 1), 'Right-Back', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Mohammedan SC (Dhaka)'), 175000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Bishwanath' AND last_name = 'Ghosh')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Bishwanath', 'Ghosh', DATEFROMPARTS(1998, 1, 1), 'Right-Back', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Bashundhara Kings'), 50000);

    -- Insert Players (Midfielders)
    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Hamza' AND last_name = 'Choudhury')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Hamza', 'Choudhury', DATEFROMPARTS(1996, 1, 1), 'Defensive Midfield', 'England', (SELECT club_id FROM Club WHERE name = 'Leicester City'), 5000000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Mohammad' AND last_name = 'Ridoy')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Mohammad', 'Ridoy', DATEFROMPARTS(2000, 1, 1), 'Defensive Midfield', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Bashundhara Kings'), 250000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Jamal' AND last_name = 'Bhuyan')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Jamal', 'Bhuyan', DATEFROMPARTS(1989, 1, 1), 'Defensive Midfield', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Brothers Union'), 75000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Quazem' AND last_name = 'Shah')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Quazem', 'Shah', DATEFROMPARTS(1997, 1, 1), 'Central Midfield', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Abahani Limited Dhaka'), 200000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Sohel' AND last_name = 'Rana')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Sohel', 'Rana', DATEFROMPARTS(1993, 1, 1), 'Central Midfield', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Bashundhara Kings'), 175000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Shamit' AND last_name = 'Shome')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Shamit', 'Shome', DATEFROMPARTS(1996, 1, 1), 'Central Midfield', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Without Club'), 175000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Fahamedul' AND last_name = 'Islam')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Fahamedul', 'Islam', DATEFROMPARTS(2005, 1, 1), 'Left Midfield', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Olbia Calcio 1905'), 10000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Shekh' AND last_name = 'Morsalin')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Shekh', 'Morsalin', DATEFROMPARTS(2004, 1, 1), 'Attacking Midfield', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Abahani Limited Dhaka'), 150000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Foysal' AND last_name = 'Ahmed Fahim')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Foysal', 'Ahmed Fahim', DATEFROMPARTS(2000, 1, 1), 'Left Winger', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Bashundhara Kings'), 200000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Shahriar' AND last_name = 'Emon')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Shahriar', 'Emon', DATEFROMPARTS(1999, 1, 1), 'Right Winger', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Bashundhara Kings'), 150000);

    -- Insert Players (Strikers)
    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Mirajul' AND last_name = 'Islam')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Mirajul', 'Islam', DATEFROMPARTS(2005, 1, 1), 'Second Striker', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Abahani Limited Dhaka'), 75000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Arman' AND last_name = 'Foysal Akash')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Arman', 'Foysal Akash', DATEFROMPARTS(2002, 1, 1), 'Centre-Forward', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'PWD SC (Dhaka)'), 75000);

    IF NOT EXISTS (SELECT 1 FROM Player WHERE first_name = 'Sumon' AND last_name = 'Reza')
        INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('Sumon', 'Reza', DATEFROMPARTS(1994, 1, 1), 'Centre-Forward', 'Bangladesh', (SELECT club_id FROM Club WHERE name = 'Mohammedan SC (Dhaka)'), 50000);

    COMMIT TRANSACTION;
    PRINT 'Successfully seeded all player data!';

END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT 'Error seeding data: ' + ERROR_MESSAGE();
END CATCH
