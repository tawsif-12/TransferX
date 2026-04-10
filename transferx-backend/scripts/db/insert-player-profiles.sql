-- Create User accounts for players
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'mitul.marma@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('mitul.marma@transferx.com', '$2a$10$dummy', 'Mitul Marma', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'sujon.hossain@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('sujon.hossain@transferx.com', '$2a$10$dummy', 'Sujon Hossain', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'mehedi.hasan.srabon@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('mehedi.hasan.srabon@transferx.com', '$2a$10$dummy', 'Mehedi Hasan Srabon', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'tariq.kazi@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('tariq.kazi@transferx.com', '$2a$10$dummy', 'Tariq Kazi', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'shakil.ahad.topu@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('shakil.ahad.topu@transferx.com', '$2a$10$dummy', 'Shakil Ahad Topu', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'saad.uddin@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('saad.uddin@transferx.com', '$2a$10$dummy', 'Saad Uddin', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'abdullah.omar@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('abdullah.omar@transferx.com', '$2a$10$dummy', 'Abdullah Omar', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'zayyan.ahmed@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('zayyan.ahmed@transferx.com', '$2a$10$dummy', 'Zayyan Ahmed', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'rahmat.mia@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('rahmat.mia@transferx.com', '$2a$10$dummy', 'Rahmat Mia', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'bishwanath.ghosh@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('bishwanath.ghosh@transferx.com', '$2a$10$dummy', 'Bishwanath Ghosh', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'hamza.choudhury@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('hamza.choudhury@transferx.com', '$2a$10$dummy', 'Hamza Choudhury', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'mohammad.ridoy@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('mohammad.ridoy@transferx.com', '$2a$10$dummy', 'Mohammad Ridoy', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'jamal.bhuyan@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('jamal.bhuyan@transferx.com', '$2a$10$dummy', 'Jamal Bhuyan', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'quazem.shah@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('quazem.shah@transferx.com', '$2a$10$dummy', 'Quazem Shah', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'sohel.rana@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('sohel.rana@transferx.com', '$2a$10$dummy', 'Sohel Rana', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'shamit.shome@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('shamit.shome@transferx.com', '$2a$10$dummy', 'Shamit Shome', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'fahamedul.islam@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('fahamedul.islam@transferx.com', '$2a$10$dummy', 'Fahamedul Islam', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'shekh.morsalin@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('shekh.morsalin@transferx.com', '$2a$10$dummy', 'Shekh Morsalin', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'foysal.ahmed.fahim@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('foysal.ahmed.fahim@transferx.com', '$2a$10$dummy', 'Foysal Ahmed Fahim', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'shahriar.emon@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('shahriar.emon@transferx.com', '$2a$10$dummy', 'Shahriar Emon', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'mirajul.islam@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('mirajul.islam@transferx.com', '$2a$10$dummy', 'Mirajul Islam', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'arman.foysal.akash@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('arman.foysal.akash@transferx.com', '$2a$10$dummy', 'Arman Foysal Akash', 'PLAYER', GETDATE(), GETDATE());
GO
IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'sumon.reza@transferx.com')
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('sumon.reza@transferx.com', '$2a$10$dummy', 'Sumon Reza', 'PLAYER', GETDATE(), GETDATE());
GO

-- Insert PlayerProfile data
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'mitul.marma@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'GOALKEEPER', 'Bangladesh', 188, 82, 'Right', 200000, 0, 0, 45, 7.8, 'Mitul Marma - Professional footballer playing as GOALKEEPER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'sujon.hossain@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'GOALKEEPER', 'Bangladesh', 190, 85, 'Right', 175000, 0, 0, 62, 7.9, 'Sujon Hossain - Professional footballer playing as GOALKEEPER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'mehedi.hasan.srabon@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'GOALKEEPER', 'Bangladesh', 186, 80, 'Right', 50000, 0, 0, 28, 7.5, 'Mehedi Hasan Srabon - Professional footballer playing as GOALKEEPER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'tariq.kazi@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'DEFENDER', 'Bangladesh', 192, 88, 'Right', 125000, 1, 0, 35, 7.4, 'Tariq Kazi - Professional footballer playing as DEFENDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'shakil.ahad.topu@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'DEFENDER', 'Bangladesh', 190, 86, 'Right', 100000, 0, 0, 22, 7.3, 'Shakil Ahad Topu - Professional footballer playing as DEFENDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'saad.uddin@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'DEFENDER', 'Bangladesh', 182, 76, 'Left', 150000, 2, 3, 42, 7.6, 'Saad Uddin - Professional footballer playing as DEFENDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'abdullah.omar@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'DEFENDER', 'Bangladesh', 183, 77, 'Left', 100000, 1, 2, 48, 7.2, 'Abdullah Omar - Professional footballer playing as DEFENDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'zayyan.ahmed@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'DEFENDER', 'Bangladesh', 180, 74, 'Left', 50000, 0, 1, 18, 7.1, 'Zayyan Ahmed - Professional footballer playing as DEFENDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'rahmat.mia@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'DEFENDER', 'Bangladesh', 184, 78, 'Right', 175000, 1, 2, 46, 7.7, 'Rahmat Mia - Professional footballer playing as DEFENDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'bishwanath.ghosh@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'DEFENDER', 'Bangladesh', 181, 75, 'Right', 50000, 0, 0, 38, 7, 'Bishwanath Ghosh - Professional footballer playing as DEFENDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'hamza.choudhury@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'MIDFIELDER', 'Bangladesh', 183, 75, 'Right', 5000000, 3, 2, 38, 7.9, 'Hamza Choudhury - Professional footballer playing as MIDFIELDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'mohammad.ridoy@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'MIDFIELDER', 'Bangladesh', 179, 71, 'Right', 250000, 2, 1, 28, 7.5, 'Mohammad Ridoy - Professional footballer playing as MIDFIELDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'jamal.bhuyan@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'MIDFIELDER', 'Bangladesh', 181, 73, 'Right', 75000, 1, 1, 52, 7.2, 'Jamal Bhuyan - Professional footballer playing as MIDFIELDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'quazem.shah@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'MIDFIELDER', 'Bangladesh', 180, 72, 'Right', 200000, 4, 5, 41, 7.7, 'Quazem Shah - Professional footballer playing as MIDFIELDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'sohel.rana@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'MIDFIELDER', 'Bangladesh', 178, 70, 'Left', 175000, 2, 3, 44, 7.4, 'Sohel Rana - Professional footballer playing as MIDFIELDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'shamit.shome@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'MIDFIELDER', 'Bangladesh', 181, 72, 'Right', 175000, 3, 4, 39, 7.5, 'Shamit Shome - Professional footballer playing as MIDFIELDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'fahamedul.islam@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'MIDFIELDER', 'Bangladesh', 175, 64, 'Left', 10000, 2, 3, 15, 7.3, 'Fahamedul Islam - Professional footballer playing as MIDFIELDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'shekh.morsalin@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'MIDFIELDER', 'Bangladesh', 177, 66, 'Right', 150000, 3, 4, 32, 7.6, 'Shekh Morsalin - Professional footballer playing as MIDFIELDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'foysal.ahmed.fahim@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'MIDFIELDER', 'Bangladesh', 176, 65, 'Left', 200000, 5, 6, 35, 7.7, 'Foysal Ahmed Fahim - Professional footballer playing as MIDFIELDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'shahriar.emon@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'MIDFIELDER', 'Bangladesh', 178, 67, 'Right', 150000, 4, 5, 33, 7.6, 'Shahriar Emon - Professional footballer playing as MIDFIELDER');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'mirajul.islam@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'FORWARD', 'Bangladesh', 182, 74, 'Right', 75000, 8, 3, 28, 7.8, 'Mirajul Islam - Professional footballer playing as FORWARD');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'arman.foysal.akash@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'FORWARD', 'Bangladesh', 185, 78, 'Right', 75000, 6, 2, 24, 7.5, 'Arman Foysal Akash - Professional footballer playing as FORWARD');
GO
DECLARE @userId INT; 
SELECT @userId = id FROM [User] WHERE email = 'sumon.reza@transferx.com';
IF @userId IS NOT NULL
INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) VALUES (@userId, 'FORWARD', 'Bangladesh', 187, 80, 'Left', 50000, 12, 2, 58, 7.7, 'Sumon Reza - Professional footballer playing as FORWARD');
GO
