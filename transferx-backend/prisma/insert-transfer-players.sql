-- Insert All Transfer Market Players from the detailed transfer data
-- This script adds all players from the "In" (arrivals) sections for each club

USE transferx;

-- MOHAMMEDAN SC (Dhaka) - Club ID: 2 - ARRIVALS (Players joining the club)
-- Bernard Morrison from Kengold SC (Ghana)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Bernard', 'Morrison', '1992-06-15', 'FORWARD', 'Ghana', 2, 50000)

-- Rafayel Tudu from Fakirapool (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Rafayel', 'Tudu', '2000-11-20', 'FORWARD', 'Bangladesh', 2, 50000)

-- Sumon Reza from Abahani (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Sumon', 'Reza', '1994-03-10', 'FORWARD', 'Bangladesh', 2, 75000)

-- Tayeb Siddique from Fakirapool (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Tayeb', 'Siddique', '1995-01-01', 'GOALKEEPER', 'Bangladesh', 2, 10000)

-- Rahmat Mia from Brothers Union (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Rahmat', 'Mia', '1999-05-15', 'DEFENDER', 'Bangladesh', 2, 200000)

-- Md Joy Ahamed from BFF Elite (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Md Joy', 'Ahamed', '1995-01-01', 'FORWARD', 'Bangladesh', 2, 0)

-- Md Kamal Merdha from BFF Elite (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Md Kamal', 'Merdha', '2009-01-01', 'MIDFIELDER', 'Bangladesh', 2, 0)

-- Md Mehedi Hasan from Abahani U18 (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Md Mehedi', 'Hasan', '1995-01-01', 'MIDFIELDER', 'Bangladesh', 2, 0)

-- Samuel Boateng from Rahmatganj (Ghana)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Samuel', 'Boateng', '1997-08-20', 'FORWARD', 'Ghana', 2, 150000)

-- Hasibur Rohman Rohit (Unknown origin)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Hasibur Rohman', 'Rohit', '1995-01-01', 'MIDFIELDER', 'Bangladesh', 2, 0)

-- Emmanuel Eli Keke from Without Club (Ghana)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Emmanuel Eli', 'Keke', '1995-03-25', 'DEFENDER', 'Ghana', 2, 0)

-- ABAHANI LIMITED DHAKA - Club ID: 1 - ARRIVALS
-- Sayed Hossain Sayem from Fakirapool (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Sayed Hossain', 'Sayem', '2001-11-15', 'MIDFIELDER', 'Bangladesh', 1, 25000)

-- Sahidul Alam from Rahmatganj (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Sahidul', 'Alam', '1991-06-20', 'GOALKEEPER', 'Bangladesh', 1, 75000)

-- Pappu Hossain from Brothers Union (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Pappu', 'Hossain', '1998-05-10', 'GOALKEEPER', 'Bangladesh', 1, 50000)

-- Alomgir Molla from Brothers Union (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Alomgir', 'Molla', '2000-12-08', 'DEFENDER', 'Bangladesh', 1, 125000)

-- Quazem Shah from Bangladesh Police (Bangladesh/Canada)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Quazem', 'Shah', '1998-06-15', 'MIDFIELDER', 'Bangladesh', 1, 175000)

-- Shekh Morsalin from Bashundhara (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Shekh', 'Morsalin', '2005-08-12', 'MIDFIELDER', 'Bangladesh', 1, 125000)

-- Sushanto Tripura from Brothers Union (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Sushanto', 'Tripura', '1998-03-25', 'DEFENDER', 'Bangladesh', 1, 200000)

-- Md Alamin Islam from Bangladesh Police (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Md Alamin', 'Islam', '2003-08-15', 'FORWARD', 'Bangladesh', 1, 100000)

-- SP Rafiz from Abahani U18 (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('SP', 'Rafiz', '2007-01-01', 'GOALKEEPER', 'Bangladesh', 1, 0)

-- Bruno Matos from Without Club (Brazil)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Bruno', 'Matos', '1989-08-10', 'MIDFIELDER', 'Brazil', 1, 0)

-- Souleymane Diabate from Mohammedan (Mali)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Souleymane', 'Diabate', '1990-12-05', 'FORWARD', 'Mali', 1, 175000)

-- Isa Faysal from Bangladesh Police (Loan) (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Isa', 'Faysal', '1999-08-22', 'DEFENDER', 'Bangladesh', 1, 250000)

-- BASHUNDHARA KINGS - Club ID: 3 - ARRIVALS
-- Cuba Mitchell from Sunderland U21 (Bangladesh/England)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Cuba', 'Mitchell', '2005-01-01', 'MIDFIELDER', 'Bangladesh', 3, 0)

-- Abu Sufian Yousuf Sifat from Dhaka Wanderers (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Abu Sufian Yousuf', 'Sifat', '1995-01-01', 'FORWARD', 'Bangladesh', 3, 25000)

-- Akmol Hossain Noyon from Chittagong Abahani (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Akmol Hossain', 'Noyon', '2004-01-01', 'MIDFIELDER', 'Bangladesh', 3, 10000)

-- Nabib Newaj Jibon from Rahmatganj (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Nabib Newaj', 'Jibon', '1990-08-15', 'FORWARD', 'Bangladesh', 3, 50000)

-- Emmanuel Tony Agbaji from Mohammedan (Nigeria)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Emmanuel Tony', 'Agbaji', '1992-05-20', 'DEFENDER', 'Nigeria', 3, 75000)

-- Mohammad Ridoy from Abahani (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Mohammad', 'Ridoy', '2001-07-12', 'MIDFIELDER', 'Bangladesh', 3, 225000)

-- Dorielton from Odisha FC (Brazil)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Dorielton', '', '1989-02-10', 'FORWARD', 'Brazil', 3, 125000)

-- Raphael Augusto from Abahani (Brazil)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Raphael', 'Augusto', '1990-09-18', 'MIDFIELDER', 'Brazil', 3, 0)

-- Emmanuel Sunday from Mohammedan (Nigeria)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Emmanuel', 'Sunday', '1991-11-08', 'FORWARD', 'Nigeria', 3, 175000)

-- Tanvir Hossain from Rahmatganj (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Tanvir', 'Hossain', '2003-08-20', 'DEFENDER', 'Bangladesh', 3, 100000)

-- Shahriar Emon from Abahani (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Shahriar', 'Emon', '2000-10-15', 'FORWARD', 'Bangladesh', 3, 175000)

-- Md Taj Uddin from Rahmatganj (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Md Taj', 'Uddin', '2001-05-22', 'DEFENDER', 'Bangladesh', 3, 200000)

-- Samuel Raksam from BFF Elite (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Samuel', 'Raksam', '2007-01-01', 'MIDFIELDER', 'Bangladesh', 3, 0)

-- Using Marma from Bashundhara U18 (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Using', 'Marma', '2006-01-01', 'MIDFIELDER', 'Bangladesh', 3, 0)

-- Onyekachi Okafor from Fortis (Loan) (Nigeria)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Onyekachi', 'Okafor', '1993-06-12', 'FORWARD', 'Nigeria', 3, 0)

-- RAHMATGANJ MFS - Club ID: 11 - ARRIVALS (already mostly inserted, adding new ones from transfer data)
-- Clement Adu from Hang Sai Macao (Ghana)
UPDATE [Player] SET current_club_id = 11 WHERE first_name = 'Clement' AND last_name = 'Adu'

-- Md Faizullah from Abahani (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
SELECT 'Md', 'Faizullah', '1995-01-01', 'MIDFIELDER', 'Bangladesh', 11, 0
WHERE NOT EXISTS (SELECT 1 FROM [Player] WHERE first_name = 'Md' AND last_name = 'Faizullah' AND current_club_id = 11)

-- BANGLADESH POLICE FC - Club ID: 12 - ARRIVALS
-- Kiran Chemjong from Punjab FC (Nepal)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Kiran', 'Chemjong', '1991-03-10', 'GOALKEEPER', 'Nepal', 12, 75000)

-- Orgyen Wangchuk Tshering from Thimphu City (Bhutan)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Orgyen Wangchuk', 'Tshering', '1999-08-15', 'MIDFIELDER', 'Bhutan', 12, 50000)

-- S. Rahman from Dhaka Rangers (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('S.', 'Rahman', '2001-06-20', 'MIDFIELDER', 'Bangladesh', 12, 10000)

-- Foday Darboe from Sur SC Oman (The Gambia)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Foday', 'Darboe', '2002-11-05', 'MIDFIELDER', 'The Gambia', 12, 75000)

-- Paulo Henrique from Club A.B.B. Bolivia (Brazil)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Paulo', 'Henrique', '1990-12-08', 'FORWARD', 'Brazil', 12, 100000)

-- Shafiq Kagimu from Rabotnicki Skopje (Uganda)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Shafiq', 'Kagimu', '1998-06-15', 'MIDFIELDER', 'Uganda', 12, 200000)

-- Sarower Zaman Nipu from Abahani (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Sarower Zaman', 'Nipu', '1999-08-10', 'FORWARD', 'Bangladesh', 12, 25000)

-- Rahul Junior from Bashundhara (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Rahul', 'Junior', '2006-05-15', 'FORWARD', 'Bangladesh', 12, 50000)

-- Riyadul Hasan Rafi from Mohammedan (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Riyadul Hasan', 'Rafi', '1999-08-20', 'DEFENDER', 'Bangladesh', 12, 150000)

-- Ayush Ghalan from Pokhara Thunders Nepal (Nepal)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Ayush', 'Ghalan', '2003-07-10', 'FORWARD', 'Nepal', 12, 125000)

-- Md Moinul Islam Moin from Mohammedan (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Md Moinul Islam', 'Moin', '2004-11-15', 'MIDFIELDER', 'Bangladesh', 12, 10000)

-- Moses Odo from Al-Ahli Wad Madani Sudan (Nigeria)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Moses', 'Odo', '1992-05-20', 'FORWARD', 'Nigeria', 12, 0)

-- FAKIRAPOOL YOUNG MEN'S CLUB - Club ID: 13 - ARRIVALS (updating existing players)
-- Louis Lasana Beavogui from Without Club (Guinea)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Louis Lasana', 'Beavogui', '1995-01-01', 'FORWARD', 'Guinea', 13, 0)

-- Mannaf Rabby from Brothers Union (Bangladesh)
UPDATE [Player] SET current_club_id = 13 WHERE first_name = 'Mannaf' AND last_name = 'Rabby'

-- Shubhajit Saha from Shastri FC India (India)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Shubhajit', 'Saha', '1996-08-10', 'GOALKEEPER', 'India', 13, 0)

-- Mohamed Shadhin from Chittagong Abahani (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Mohamed', 'Shadhin', '1999-11-08', 'FORWARD', 'Bangladesh', 13, 50000)

-- Hossain Mohammed Arian from Brothers Union (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Hossain Mohammed', 'Arian', '2005-07-20', 'FORWARD', 'Bangladesh', 13, 0)

-- Ben Ibrahim Ouattara from Unknown (Cote d'Ivoire)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Ben Ibrahim', 'Ouattara', '1997-09-15', 'FORWARD', 'Cote d''Ivoire', 13, 0)

-- Mohammad Khorshed Alam from Azampur FC Uttara (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Mohammad Khorshed', 'Alam', '1994-04-12', 'DEFENDER', 'Bangladesh', 13, 0)

-- Md Mahid Sheikh from Dhaka Wanderers (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Md Mahid', 'Sheikh', '2005-03-18', 'FORWARD', 'Bangladesh', 13, 10000)

-- Mostafa Kahraba from Rahmatganj (Egypt)
UPDATE [Player] SET current_club_id = 13 WHERE first_name LIKE '%Mostafa%' AND last_name LIKE '%Kahraba%'

-- Apon Chandra Roy from Without Club (Bangladesh)
INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
VALUES ('Apon Chandra', 'Roy', '1995-01-01', 'FORWARD', 'Bangladesh', 13, 0)

-- Summary
SELECT 
    COUNT(*) as total_players,
    COUNT(DISTINCT current_club_id) as clubs_with_players
FROM [Player];

PRINT 'All transfer market players have been successfully added!';
