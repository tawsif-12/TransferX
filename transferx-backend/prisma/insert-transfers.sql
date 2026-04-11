-- Insert Transfer Records for Bangladesh Premier League
-- This script contains all player transfers (arrivals and departures)

USE transferx;

-- First, create a "Free Agent" club entry for transfers from outside or to unknown clubs
IF NOT EXISTS (SELECT 1 FROM [Club] WHERE club_id = 999)
BEGIN
    -- We'll use club_id=999 as a placeholder for "Without Club" transfers
    SET IDENTITY_INSERT [Club] ON
    INSERT INTO [Club] (club_id, league_id, name, country, founded_year)
    VALUES (999, 1, 'Free Agent / Without Club', 'Bangladesh', 2000)
    SET IDENTITY_INSERT [Club] OFF
END

-- MOHAMMEDAN SC (Dhaka) - Club ID: 2
-- Arrivals (Into the club) - Key transfers from database players
-- Bernard Morrison from Kengold SC (Outside Bangladesh) - using free agent
INSERT INTO [Transfer] (player_id, from_club_id, to_club_id, transfer_fee, transfer_date, transfer_type)
SELECT TOP 1 p.player_id, 999, 2, 50000, '2025-08-15', 'FREE'
FROM [Player] p
WHERE p.first_name LIKE '%Bernard%' AND p.last_name LIKE '%Morrison%'
AND NOT EXISTS (SELECT 1 FROM [Transfer] t WHERE t.player_id = p.player_id AND t.to_club_id = 2)

-- Rafayel Tudu from Fakirapool Young Men's Club (ID: 13)
UNION ALL
SELECT TOP 1 p.player_id, 13, 2, 50000, '2025-08-15', 'FREE'
FROM [Player] p
WHERE p.first_name LIKE '%Rafayel%' AND p.last_name LIKE '%Tudu%'
AND NOT EXISTS (SELECT 1 FROM [Transfer] t WHERE t.player_id = p.player_id AND t.to_club_id = 2 AND t.from_club_id = 13)

-- Sumon Reza from Abahani Limited Dhaka (ID: 1)
UNION ALL
SELECT TOP 1 p.player_id, 1, 2, 75000, '2025-08-15', 'FREE'
FROM [Player] p
WHERE p.first_name LIKE '%Sumon%' AND p.last_name LIKE '%Reza%'
AND NOT EXISTS (SELECT 1 FROM [Transfer] t WHERE t.player_id = p.player_id AND t.to_club_id = 2 AND t.from_club_id = 1);

-- For departures, use the updated clubs
-- Emmanuel Sunday - Departed from Mohammedan to Bashundhara Kings (3)
INSERT INTO [Transfer] (player_id, from_club_id, to_club_id, transfer_fee, transfer_date, transfer_type)
SELECT TOP 1 p.player_id, 2, 3, 175000, '2025-08-15', 'FREE'
FROM [Player] p
WHERE p.first_name LIKE '%Emmanuel%' AND p.last_name LIKE '%Sunday%'
AND NOT EXISTS (SELECT 1 FROM [Transfer] t WHERE t.player_id = p.player_id AND t.from_club_id = 2 AND t.to_club_id = 3);

-- BASHUNDHARA KINGS - Club ID: 3
-- Mohammad Ridoy from Abahani (1) to Bashundhara (3)
INSERT INTO [Transfer] (player_id, from_club_id, to_club_id, transfer_fee, transfer_date, transfer_type)
SELECT TOP 1 p.player_id, 1, 3, 225000, '2025-08-15', 'FREE'
FROM [Player] p
WHERE p.first_name LIKE '%Mohammad%' AND p.last_name LIKE '%Ridoy%'
AND NOT EXISTS (SELECT 1 FROM [Transfer] t WHERE t.player_id = p.player_id AND t.from_club_id = 1 AND t.to_club_id = 3);

-- ABAHANI LIMITED DHAKA - Club ID: 1
-- Isa Faysal from Bangladesh Police (12) on Loan to Abahani (1)
INSERT INTO [Transfer] (player_id, from_club_id, to_club_id, transfer_fee, transfer_date, transfer_type)
SELECT TOP 1 p.player_id, 12, 1, 250000, '2025-08-15', 'LOAN'
FROM [Player] p
WHERE p.first_name LIKE '%Isa%' AND p.last_name LIKE '%Faysal%'
AND NOT EXISTS (SELECT 1 FROM [Transfer] t WHERE t.player_id = p.player_id AND t.from_club_id = 12 AND t.to_club_id = 1);

-- BANGLADESH POLICE FC - Club ID: 12
-- Riyadul Hasan Rafi from Mohammedan (2) to Police (12)
INSERT INTO [Transfer] (player_id, from_club_id, to_club_id, transfer_fee, transfer_date, transfer_type)
SELECT TOP 1 p.player_id, 2, 12, 150000, '2025-08-15', 'FREE'
FROM [Player] p
WHERE p.first_name LIKE '%Riyadul%' AND p.last_name LIKE '%Rafi%'
AND NOT EXISTS (SELECT 1 FROM [Transfer] t WHERE t.player_id = p.player_id AND t.from_club_id = 2 AND t.to_club_id = 12);

-- FORTIS FC - Club ID: 5
-- Shanto Kumar Ray from Fortis (5) to Brothers Union (17)
INSERT INTO [Transfer] (player_id, from_club_id, to_club_id, transfer_fee, transfer_date, transfer_type)
SELECT TOP 1 p.player_id, 5, 17, 10000, '2025-08-15', 'FREE'
FROM [Player] p
WHERE p.first_name LIKE '%Shanto%' AND p.last_name LIKE '%Ray%'
AND NOT EXISTS (SELECT 1 FROM [Transfer] t WHERE t.player_id = p.player_id AND t.from_club_id = 5 AND t.to_club_id = 17);

-- Summary statistics
SELECT 
    COUNT(*) as total_transfers,
    SUM(CAST(transfer_fee AS FLOAT)) as total_fee_value,
    COUNT(DISTINCT from_club_id) as clubs_transferring_out,
    COUNT(DISTINCT to_club_id) as clubs_transferring_in
FROM [Transfer];

-- Transfers by club
SELECT 
    c.name as club_name,
    COUNT(t.transfer_id) as transfer_count,
    SUM(CAST(t.transfer_fee AS FLOAT)) as total_fee
FROM [Transfer] t
LEFT JOIN [Club] c ON t.from_club_id = c.club_id OR t.to_club_id = c.club_id
GROUP BY c.name
ORDER BY transfer_count DESC;

PRINT 'Transfer records have been successfully inserted!';
PRINT 'You can now view all transfers on the Transfers Page.';
