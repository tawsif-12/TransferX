-- ============================================================================
-- STORED PROCEDURES AND TRIGGERS FOR TRANSFERX DATABASE
-- ============================================================================

-- ============================================================================
-- 1. STORED PROCEDURES
-- ============================================================================

/**
 * sp_GetPlayersByClub
 * Returns all players in a specific club with their contract and transfer details
 * Uses JOINs and subqueries to aggregate player statistics
 */
IF OBJECT_ID('sp_GetPlayersByClub', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetPlayersByClub;
GO

CREATE PROCEDURE sp_GetPlayersByClub
    @ClubId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.player_id,
        p.first_name,
        p.last_name,
        p.position,
        p.nationality,
        p.fee,
        c.name as club_name,
        c.country as club_country,
        l.name as league_name,
        (SELECT COUNT(*) FROM Contract WHERE player_id = p.player_id AND end_date >= GETDATE()) as active_contracts,
        (SELECT COUNT(*) FROM Transfer WHERE player_id = p.player_id) as total_transfers,
        (SELECT SUM(CAST(transfer_fee AS FLOAT)) FROM Transfer WHERE player_id = p.player_id) as career_transfer_value
    FROM Player p
    INNER JOIN Club c ON p.current_club_id = c.club_id
    LEFT JOIN League l ON c.league_id = l.league_id
    WHERE p.current_club_id = @ClubId
    ORDER BY p.last_name, p.first_name;
END;
GO

/**
 * sp_CalculateClubNetSpend
 * Calculates total spent vs received for player transfers for each club
 * Uses aggregation with multiple JOINs
 */
IF OBJECT_ID('sp_CalculateClubNetSpend', 'P') IS NOT NULL
    DROP PROCEDURE sp_CalculateClubNetSpend;
GO

CREATE PROCEDURE sp_CalculateClubNetSpend
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        c.club_id,
        c.name,
        c.country,
        l.name as league_name,
        COUNT(DISTINCT t1.transfer_id) as transfers_bought,
        COUNT(DISTINCT t2.transfer_id) as transfers_sold,
        CAST(ISNULL(SUM(CASE WHEN t1.transfer_id IS NOT NULL THEN CAST(t1.transfer_fee AS FLOAT) ELSE 0 END), 0) AS FLOAT) as total_spent,
        CAST(ISNULL(SUM(CASE WHEN t2.transfer_id IS NOT NULL THEN CAST(t2.transfer_fee AS FLOAT) ELSE 0 END), 0) AS FLOAT) as total_received,
        CAST(ISNULL(SUM(CASE WHEN t1.transfer_id IS NOT NULL THEN CAST(t1.transfer_fee AS FLOAT) ELSE 0 END), 0) - 
             ISNULL(SUM(CASE WHEN t2.transfer_id IS NOT NULL THEN CAST(t2.transfer_fee AS FLOAT) ELSE 0 END), 0) AS FLOAT) as net_spend
    FROM Club c
    LEFT JOIN League l ON c.league_id = l.league_id
    LEFT JOIN Transfer t1 ON c.club_id = t1.to_club_id
    LEFT JOIN Transfer t2 ON c.club_id = t2.from_club_id
    GROUP BY c.club_id, c.name, c.country, l.name
    ORDER BY net_spend DESC;
END;
GO

/**
 * sp_GetPlayerTransferHistory
 * Returns complete transfer history for a player with club and league information
 * Demonstrates complex JOIN and subquery operations
 */
IF OBJECT_ID('sp_GetPlayerTransferHistory', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetPlayerTransferHistory;
GO

CREATE PROCEDURE sp_GetPlayerTransferHistory
    @PlayerId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        t.transfer_id,
        t.transfer_date,
        t.transfer_type,
        CAST(t.transfer_fee AS FLOAT) as transfer_fee,
        p.first_name,
        p.last_name,
        p.position,
        fc.name as from_club,
        fc.country as from_country,
        fl.name as from_league,
        tc.name as to_club,
        tc.country as to_country,
        tl.name as to_league,
        DATEDIFF(MONTH, t.transfer_date, GETDATE()) as months_ago
    FROM Transfer t
    INNER JOIN Player p ON t.player_id = p.player_id
    LEFT JOIN Club fc ON t.from_club_id = fc.club_id
    LEFT JOIN League fl ON fc.league_id = fl.league_id
    LEFT JOIN Club tc ON t.to_club_id = tc.club_id
    LEFT JOIN League tl ON tc.league_id = tl.league_id
    WHERE t.player_id = @PlayerId
    ORDER BY t.transfer_date DESC;
END;
GO

/**
 * sp_GetExpiringContracts
 * Returns contracts expiring within specified days with player and club details
 * Uses transaction-based approach for consistency
 */
IF OBJECT_ID('sp_GetExpiringContracts', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetExpiringContracts;
GO

CREATE PROCEDURE sp_GetExpiringContracts
    @DaysFromNow INT = 90
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    SELECT 
        c.contract_id,
        p.player_id,
        p.first_name,
        p.last_name,
        p.position,
        cl.name as club_name,
        cl.country as club_country,
        c.start_date,
        c.end_date,
        CAST(c.salary AS FLOAT) as salary,
        DATEDIFF(DAY, GETDATE(), c.end_date) as days_remaining,
        CASE 
            WHEN c.end_date < GETDATE() THEN 'Expired'
            WHEN DATEDIFF(DAY, GETDATE(), c.end_date) <= 30 THEN 'Critical'
            WHEN DATEDIFF(DAY, GETDATE(), c.end_date) <= @DaysFromNow THEN 'Warning'
            ELSE 'Active'
        END as urgency
    FROM Contract c
    INNER JOIN Player p ON c.player_id = p.player_id
    INNER JOIN Club cl ON c.club_id = cl.club_id
    WHERE DATEDIFF(DAY, GETDATE(), c.end_date) <= @DaysFromNow
    ORDER BY c.end_date ASC;
    
    COMMIT TRANSACTION;
END;
GO

-- ============================================================================
-- 2. TRIGGERS
-- ============================================================================

/**
 * trg_UpdateTransferHistory
 * Trigger to automatically create TransferHistory records when a Transfer is inserted
 * This maintains data consistency and creates an audit trail
 */
IF OBJECT_ID('trg_UpdateTransferHistory', 'TR') IS NOT NULL
    DROP TRIGGER trg_UpdateTransferHistory;
GO

CREATE TRIGGER trg_UpdateTransferHistory
ON Transfer
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    -- Insert into TransferHistory for each new transfer
    INSERT INTO TransferHistory (transfer_id, player_id, from_club_id, to_club_id, transfer_date, status)
    SELECT 
        inserted.transfer_id,
        inserted.player_id,
        inserted.from_club_id,
        inserted.to_club_id,
        inserted.transfer_date,
        'COMPLETED'
    FROM inserted;
    
    -- Update player's current club
    UPDATE Player
    SET current_club_id = inserted.to_club_id
    FROM inserted
    WHERE Player.player_id = inserted.player_id;
    
    COMMIT TRANSACTION;
END;
GO

/**
 * trg_ValidateContractDates
 * Trigger to validate that contract end_date is after start_date
 * Prevents invalid contracts from being inserted or updated
 */
IF OBJECT_ID('trg_ValidateContractDates', 'TR') IS NOT NULL
    DROP TRIGGER trg_ValidateContractDates;
GO

CREATE TRIGGER trg_ValidateContractDates
ON Contract
INSTEAD OF INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if any record has end_date <= start_date
    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE end_date <= start_date
    )
    BEGIN
        RAISERROR('Contract end_date must be after start_date', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
    
    -- If this is an INSERT
    IF NOT EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO Contract (player_id, club_id, start_date, end_date, salary, created_at)
        SELECT player_id, club_id, start_date, end_date, salary, GETDATE()
        FROM inserted;
    END
    ELSE
    -- If this is an UPDATE
    BEGIN
        UPDATE Contract
        SET 
            player_id = inserted.player_id,
            club_id = inserted.club_id,
            start_date = inserted.start_date,
            end_date = inserted.end_date,
            salary = inserted.salary
        FROM inserted
        WHERE Contract.contract_id = inserted.contract_id;
    END
END;
GO

/**
 * trg_AuditPlayerChanges
 * Trigger to log changes to Player table (optional audit trail)
 * Tracks modifications for compliance and debugging
 */
IF OBJECT_ID('trg_AuditPlayerChanges', 'TR') IS NOT NULL
    DROP TRIGGER trg_AuditPlayerChanges;
GO

CREATE TRIGGER trg_AuditPlayerChanges
ON Player
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- In a real system, you would log these changes to an audit table
    -- For now, we'll just log to console/application
    INSERT INTO TransferHistory (transfer_id, player_id, from_club_id, to_club_id, transfer_date, status)
    SELECT 
        0, -- No transfer_id for audit
        deleted.player_id,
        deleted.current_club_id,
        inserted.current_club_id,
        GETDATE(),
        'CLUB_CHANGE'
    FROM deleted
    INNER JOIN inserted ON deleted.player_id = inserted.player_id
    WHERE deleted.current_club_id != inserted.current_club_id;
END;
GO

-- ============================================================================
-- 3. VIEWS
-- ============================================================================

/**
 * vw_PlayerTransferStats
 * View providing comprehensive player statistics including transfer metrics
 * Uses aggregation and subqueries
 */
IF OBJECT_ID('vw_PlayerTransferStats', 'V') IS NOT NULL
    DROP VIEW vw_PlayerTransferStats;
GO

CREATE VIEW vw_PlayerTransferStats AS
SELECT 
    p.player_id,
    p.first_name,
    p.last_name,
    p.position,
    p.nationality,
    p.fee,
    c.name as current_club,
    l.name as current_league,
    COUNT(t.transfer_id) as total_transfers,
    SUM(CAST(t.transfer_fee AS FLOAT)) as career_transfer_value,
    AVG(CAST(t.transfer_fee AS FLOAT)) as avg_transfer_fee,
    COUNT(DISTINCT ct.contract_id) as total_contracts,
    COUNT(DISTINCT pa.agent_id) as agent_count,
    MAX(t.transfer_date) as last_transfer_date,
    DATEDIFF(YEAR, p.date_of_birth, GETDATE()) as age
FROM Player p
LEFT JOIN Club c ON p.current_club_id = c.club_id
LEFT JOIN League l ON c.league_id = l.league_id
LEFT JOIN Transfer t ON p.player_id = t.player_id
LEFT JOIN Contract ct ON p.player_id = ct.player_id
LEFT JOIN PlayerAgent pa ON p.player_id = pa.player_id
GROUP BY p.player_id, p.first_name, p.last_name, p.position, p.nationality, 
         p.fee, p.date_of_birth, c.name, l.name;
GO

/**
 * vw_ClubTransferAnalysis
 * View analyzing club transfer activity with net spend calculations
 */
IF OBJECT_ID('vw_ClubTransferAnalysis', 'V') IS NOT NULL
    DROP VIEW vw_ClubTransferAnalysis;
GO

CREATE VIEW vw_ClubTransferAnalysis AS
SELECT 
    c.club_id,
    c.name,
    c.country,
    l.name as league_name,
    COUNT(DISTINCT t_in.transfer_id) as players_bought,
    COUNT(DISTINCT t_out.transfer_id) as players_sold,
    CAST(ISNULL(SUM(CASE WHEN t_in.transfer_id IS NOT NULL THEN CAST(t_in.transfer_fee AS FLOAT) END), 0) AS FLOAT) as total_spent,
    CAST(ISNULL(SUM(CASE WHEN t_out.transfer_id IS NOT NULL THEN CAST(t_out.transfer_fee AS FLOAT) END), 0) AS FLOAT) as total_received,
    CAST(ISNULL(SUM(CASE WHEN t_in.transfer_id IS NOT NULL THEN CAST(t_in.transfer_fee AS FLOAT) END), 0) - 
         ISNULL(SUM(CASE WHEN t_out.transfer_id IS NOT NULL THEN CAST(t_out.transfer_fee AS FLOAT) END), 0) AS FLOAT) as net_spend,
    COUNT(DISTINCT pc.player_id) as current_squad_size
FROM Club c
LEFT JOIN League l ON c.league_id = l.league_id
LEFT JOIN Transfer t_in ON c.club_id = t_in.to_club_id
LEFT JOIN Transfer t_out ON c.club_id = t_out.from_club_id
LEFT JOIN Player pc ON pc.current_club_id = c.club_id
GROUP BY c.club_id, c.name, c.country, l.name;
GO

-- ============================================================================
-- TEST PROCEDURES
-- ============================================================================

-- Test sp_GetPlayersByClub (assumes club_id = 1 exists)
-- EXEC sp_GetPlayersByClub @ClubId = 1;

-- Test sp_CalculateClubNetSpend
-- EXEC sp_CalculateClubNetSpend;

-- Test sp_GetPlayerTransferHistory (assumes player_id = 1 exists)
-- EXEC sp_GetPlayerTransferHistory @PlayerId = 1;

-- Test sp_GetExpiringContracts with default 90 days
-- EXEC sp_GetExpiringContracts;

-- Query the views
-- SELECT * FROM vw_PlayerTransferStats;
-- SELECT * FROM vw_ClubTransferAnalysis;
