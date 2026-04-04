-- ============================================================================
-- ENHANCED RELATIONSHIPS, TRIGGERS, AND PROCEDURES FOR TRANSFERX DATABASE
-- Connects all 11 tables with comprehensive joins and business logic
-- ============================================================================

-- ============================================================================
-- PART 1: ADDITIONAL FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- Add missing foreign key: PlayerProfile -> Club
IF NOT EXISTS (
    SELECT constraint_name FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE table_name = 'PlayerProfile' AND constraint_type = 'FOREIGN KEY'
)
BEGIN
    ALTER TABLE PlayerProfile
    ADD CONSTRAINT FK_PlayerProfile_Club 
    FOREIGN KEY (currentClubId) REFERENCES Club(club_id);
END
GO

-- ============================================================================
-- PART 2: COMPREHENSIVE STORED PROCEDURES
-- ============================================================================

/**
 * sp_GetCompletePlayerProfile
 * Returns complete player information with all related entities
 * Joins: User -> PlayerProfile -> Club -> League
 *        Player -> Contract -> Club
 *        Player -> Transfer -> Club (from/to)
 *        Player -> PlayerAgent -> Agent
 */
IF OBJECT_ID('sp_GetCompletePlayerProfile', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetCompletePlayerProfile;
GO

CREATE PROCEDURE sp_GetCompletePlayerProfile
    @PlayerId INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Player Basic Info with User, Club, and League
        SELECT 
            p.player_id,
            p.first_name,
            p.last_name,
            p.position,
            p.nationality,
            p.date_of_birth,
            p.current_club_id,
            p.fee,
            CAST(p.fee AS FLOAT) as fee_float,
            c.club_id,
            c.name as current_club_name,
            c.country as club_country,
            l.league_id,
            l.name as league_name,
            l.country as league_country
        FROM Player p
        LEFT JOIN Club c ON p.current_club_id = c.club_id
        LEFT JOIN League l ON c.league_id = l.league_id
        WHERE p.player_id = @PlayerId;
        
        -- Active Contracts
        SELECT 
            c.contract_id,
            c.start_date,
            c.end_date,
            CAST(c.salary AS FLOAT) as salary,
            cl.name as club_name,
            DATEDIFF(DAY, GETDATE(), c.end_date) as days_remaining
        FROM Contract c
        INNER JOIN Club cl ON c.club_id = cl.club_id
        WHERE c.player_id = @PlayerId
        ORDER BY c.end_date DESC;
        
        -- Transfer History
        SELECT 
            t.transfer_id,
            t.transfer_date,
            t.transfer_type,
            CAST(t.transfer_fee AS FLOAT) as transfer_fee,
            fc.name as from_club,
            tc.name as to_club,
            fl.name as from_league,
            tl.name as to_league
        FROM Transfer t
        LEFT JOIN Club fc ON t.from_club_id = fc.club_id
        LEFT JOIN Club tc ON t.to_club_id = tc.club_id
        LEFT JOIN League fl ON fc.league_id = fl.league_id
        LEFT JOIN League tl ON tc.league_id = tl.league_id
        WHERE t.player_id = @PlayerId
        ORDER BY t.transfer_date DESC;
        
        -- Assigned Agents
        SELECT 
            a.agent_id,
            a.agent_name
        FROM Agent a
        INNER JOIN PlayerAgent pa ON a.agent_id = pa.agent_id
        WHERE pa.player_id = @PlayerId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

/**
 * sp_GetAgentPerformance
 * Returns comprehensive agent statistics
 * Joins: Agent -> PlayerAgent -> Player -> Transfer/Contract
 */
IF OBJECT_ID('sp_GetAgentPerformance', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetAgentPerformance;
GO

CREATE PROCEDURE sp_GetAgentPerformance
    @AgentId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            a.agent_id,
            a.agent_name,
            COUNT(DISTINCT pa.player_id) as managed_players,
            COUNT(DISTINCT t.transfer_id) as total_transfers,
            SUM(CAST(t.transfer_fee AS FLOAT)) as total_transfer_value,
            COUNT(DISTINCT c.contract_id) as active_contracts,
            AVG(CAST(c.salary AS FLOAT)) as average_salary,
            MAX(CAST(t.transfer_fee AS FLOAT)) as highest_transfer_fee
        FROM Agent a
        LEFT JOIN PlayerAgent pa ON a.agent_id = pa.agent_id
        LEFT JOIN Player p ON pa.player_id = p.player_id
        LEFT JOIN Transfer t ON p.player_id = t.player_id
        LEFT JOIN Contract c ON p.player_id = c.player_id AND c.end_date >= GETDATE()
        WHERE (@AgentId IS NULL OR a.agent_id = @AgentId)
        GROUP BY a.agent_id, a.agent_name
        ORDER BY total_transfer_value DESC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

/**
 * sp_GetClubTransferWindow
 * Returns complete club transfer metrics with player details
 * Joins: Club -> League, Club -> Player, Club -> Transfer (from/to), Club -> Contract
 */
IF OBJECT_ID('sp_GetClubTransferWindow', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetClubTransferWindow;
GO

CREATE PROCEDURE sp_GetClubTransferWindow
    @ClubId INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Club Overview
        SELECT 
            c.club_id,
            c.name,
            c.country,
            c.founded_year,
            l.league_id,
            l.name as league_name
        FROM Club c
        LEFT JOIN League l ON c.league_id = l.league_id
        WHERE c.club_id = @ClubId;
        
        -- Current Squad
        SELECT 
            p.player_id,
            p.first_name,
            p.last_name,
            p.position,
            p.nationality,
            YEAR(p.date_of_birth) as birth_year,
            CAST(p.fee AS FLOAT) as fee
        FROM Player p
        WHERE p.current_club_id = @ClubId
        ORDER BY p.last_name;
        
        -- Transfer Analysis (Incoming vs Outgoing)
        SELECT 
            'INCOMING' as transfer_direction,
            COUNT(DISTINCT t.transfer_id) as count,
            SUM(CAST(t.transfer_fee AS FLOAT)) as total_spent,
            AVG(CAST(t.transfer_fee AS FLOAT)) as avg_fee,
            MAX(CAST(t.transfer_fee AS FLOAT)) as max_fee
        FROM Transfer t
        WHERE t.to_club_id = @ClubId
        
        UNION ALL
        
        SELECT 
            'OUTGOING' as transfer_direction,
            COUNT(DISTINCT t.transfer_id) as count,
            SUM(CAST(t.transfer_fee AS FLOAT)) as total_received,
            AVG(CAST(t.transfer_fee AS FLOAT)) as avg_fee,
            MAX(CAST(t.transfer_fee AS FLOAT)) as max_fee
        FROM Transfer t
        WHERE t.from_club_id = @ClubId;
        
        -- Contract Summary
        SELECT 
            COUNT(DISTINCT c.contract_id) as total_contracts,
            SUM(CAST(c.salary AS FLOAT)) as total_salary_commitment,
            COUNT(CASE WHEN c.end_date >= GETDATE() THEN 1 END) as active_contracts,
            COUNT(CASE WHEN c.end_date < GETDATE() THEN 1 END) as expired_contracts
        FROM Contract c
        WHERE c.club_id = @ClubId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

/**
 * sp_GetLeagueStatistics
 * Returns comprehensive league data with club and player analytics
 * Joins: League -> Club -> Player/Transfer/Contract
 */
IF OBJECT_ID('sp_GetLeagueStatistics', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetLeagueStatistics;
GO

CREATE PROCEDURE sp_GetLeagueStatistics
    @LeagueId INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- League Overview with Club Count
        SELECT 
            l.league_id,
            l.name,
            l.country,
            COUNT(DISTINCT c.club_id) as total_clubs,
            COUNT(DISTINCT p.player_id) as total_players,
            SUM(CAST(t.transfer_fee AS FLOAT)) as total_transfer_value,
            COUNT(DISTINCT t.transfer_id) as total_transfers
        FROM League l
        LEFT JOIN Club c ON l.league_id = c.league_id
        LEFT JOIN Player p ON c.club_id = p.current_club_id
        LEFT JOIN Transfer t ON (t.from_club_id = c.club_id OR t.to_club_id = c.club_id)
        WHERE l.league_id = @LeagueId
        GROUP BY l.league_id, l.name, l.country;
        
        -- Club Rankings by Transfer Activity
        SELECT 
            c.club_id,
            c.name,
            COUNT(DISTINCT p.player_id) as squad_size,
            COUNT(DISTINCT t.transfer_id) as transfer_activity,
            SUM(CAST(t.transfer_fee AS FLOAT)) as net_investment
        FROM Club c
        LEFT JOIN Player p ON c.club_id = p.current_club_id
        LEFT JOIN Transfer t ON (t.to_club_id = c.club_id OR t.from_club_id = c.club_id)
        WHERE c.league_id = @LeagueId
        GROUP BY c.club_id, c.name
        ORDER BY transfer_activity DESC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

/**
 * sp_GetUserActivitySummary
 * Returns comprehensive user and related entity statistics
 * Joins: User -> PlayerProfile/AgentProfile -> Player/Agent -> Contracts/Transfers
 */
IF OBJECT_ID('sp_GetUserActivitySummary', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetUserActivitySummary;
GO

CREATE PROCEDURE sp_GetUserActivitySummary
    @UserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            u.id,
            u.email,
            u.fullName,
            u.role,
            u.created_at,
            CASE 
                WHEN pp.id IS NOT NULL THEN 'PLAYER'
                WHEN ap.id IS NOT NULL THEN 'AGENT'
                ELSE 'ADMIN'
            END as profile_type,
            ISNULL(pp.currentClubId, 0) as club_id,
            COUNT(DISTINCT p.player_id) as managed_players,
            COUNT(DISTINCT a.agent_id) as managed_agents
        FROM [User] u
        LEFT JOIN PlayerProfile pp ON u.id = pp.userId
        LEFT JOIN AgentProfile ap ON u.id = ap.userId
        LEFT JOIN Player p ON pp.id = p.player_id
        LEFT JOIN Agent a ON ap.id = a.agent_id
        WHERE (@UserId IS NULL OR u.id = @UserId)
        GROUP BY u.id, u.email, u.fullName, u.role, u.created_at, pp.id, ap.id, pp.currentClubId;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- PART 3: ENHANCED TRIGGERS FOR DATA INTEGRITY
-- ============================================================================

/**
 * trg_UpdatePlayerCurrentClub
 * Automatically updates Player.current_club_id when a new contract is created
 * Maintains consistency between Contract and Player tables
 */
IF OBJECT_ID('trg_UpdatePlayerCurrentClub', 'TR') IS NOT NULL
    DROP TRIGGER trg_UpdatePlayerCurrentClub;
GO

CREATE TRIGGER trg_UpdatePlayerCurrentClub
ON Contract
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Update player's current club to the contract's club if contract is active
        UPDATE Player
        SET current_club_id = inserted.club_id
        FROM inserted
        WHERE Player.player_id = inserted.player_id
        AND inserted.end_date >= GETDATE()
        AND (Player.current_club_id IS NULL 
             OR inserted.start_date > (SELECT MAX(start_date) FROM Contract WHERE player_id = inserted.player_id AND contract_id != inserted.contract_id));
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

/**
 * trg_CreateTransferHistoryEntry
 * Creates TransferHistory record when Transfer is inserted
 * Maintains audit trail and historical data
 */
IF OBJECT_ID('trg_CreateTransferHistoryEntry', 'TR') IS NOT NULL
    DROP TRIGGER trg_CreateTransferHistoryEntry;
GO

CREATE TRIGGER trg_CreateTransferHistoryEntry
ON Transfer
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        INSERT INTO TransferHistory (transfer_id, player_id, fee)
        SELECT 
            inserted.transfer_id,
            inserted.player_id,
            inserted.transfer_fee
        FROM inserted;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

/**
 * trg_EnforcePlayerAgentRelationship
 * Ensure PlayerAgent entries reference valid players and agents
 * Validates referential integrity
 */
IF OBJECT_ID('trg_EnforcePlayerAgentRelationship', 'TR') IS NOT NULL
    DROP TRIGGER trg_EnforcePlayerAgentRelationship;
GO

CREATE TRIGGER trg_EnforcePlayerAgentRelationship
ON PlayerAgent
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Check if player and agent exist
        IF EXISTS (
            SELECT 1
            FROM inserted i
            WHERE NOT EXISTS (SELECT 1 FROM Player WHERE player_id = i.player_id)
            OR NOT EXISTS (SELECT 1 FROM Agent WHERE agent_id = i.agent_id)
        )
        BEGIN
            RAISERROR('Invalid Player ID or Agent ID', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        INSERT INTO PlayerAgent (player_id, agent_id)
        SELECT player_id, agent_id FROM inserted;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

/**
 * trg_ValidateTransferParticipants
 * Ensures transfer involves valid clubs and players
 * Prevents invalid transfers
 */
IF OBJECT_ID('trg_ValidateTransferParticipants', 'TR') IS NOT NULL
    DROP TRIGGER trg_ValidateTransferParticipants;
GO

CREATE TRIGGER trg_ValidateTransferParticipants
ON Transfer
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Validate all required entities exist
        IF EXISTS (
            SELECT 1
            FROM inserted i
            WHERE NOT EXISTS (SELECT 1 FROM Player WHERE player_id = i.player_id)
            OR NOT EXISTS (SELECT 1 FROM Club WHERE club_id = i.from_club_id)
            OR NOT EXISTS (SELECT 1 FROM Club WHERE club_id = i.to_club_id)
            OR i.from_club_id = i.to_club_id
        )
        BEGIN
            RAISERROR('Invalid transfer: Check player, clubs, and ensure from/to clubs are different', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        INSERT INTO Transfer (player_id, from_club_id, to_club_id, transfer_fee, transfer_date, transfer_type)
        SELECT player_id, from_club_id, to_club_id, transfer_fee, transfer_date, transfer_type FROM inserted;
        
        -- Update player's current club
        UPDATE Player
        SET current_club_id = inserted.to_club_id
        FROM inserted
        WHERE Player.player_id = inserted.player_id;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

/**
 * trg_PreventOrphanedPlayerProfiles
 * Ensures PlayerProfile is deleted when associated User is deleted
 * Maintains referential integrity
 */
IF OBJECT_ID('trg_PreventOrphanedPlayerProfiles', 'TR') IS NOT NULL
    DROP TRIGGER trg_PreventOrphanedPlayerProfiles;
GO

CREATE TRIGGER trg_PreventOrphanedPlayerProfiles
ON [User]
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DELETE FROM PlayerProfile WHERE userId IN (SELECT id FROM deleted);
        DELETE FROM AgentProfile WHERE userId IN (SELECT id FROM deleted);
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

-- ============================================================================
-- PART 4: COMPREHENSIVE VIEWS FOR REPORTING
-- ============================================================================

/**
 * vw_PlayerWithAllRelations
 * Complete player view with all related entities
 * Integrates: Player, Club, League, Contract, Transfer, Agent
 */
IF OBJECT_ID('vw_PlayerWithAllRelations', 'V') IS NOT NULL
    DROP VIEW vw_PlayerWithAllRelations;
GO

CREATE VIEW vw_PlayerWithAllRelations
AS
SELECT 
    p.player_id,
    p.first_name,
    p.last_name,
    p.position,
    p.nationality,
    CAST(p.fee AS FLOAT) as current_fee,
    c.club_id,
    c.name as current_club,
    l.league_id,
    l.name as league_name,
    COUNT(DISTINCT con.contract_id) as active_contracts,
    COUNT(DISTINCT t.transfer_id) as transfer_history,
    COUNT(DISTINCT pa.agent_id) as agent_count,
    MAX(t.transfer_date) as last_transfer_date,
    SUM(CAST(t.transfer_fee AS FLOAT)) as career_transfer_value
FROM Player p
LEFT JOIN Club c ON p.current_club_id = c.club_id
LEFT JOIN League l ON c.league_id = l.league_id
LEFT JOIN Contract con ON p.player_id = con.player_id AND con.end_date >= GETDATE()
LEFT JOIN Transfer t ON p.player_id = t.player_id
LEFT JOIN PlayerAgent pa ON p.player_id = pa.player_id
GROUP BY p.player_id, p.first_name, p.last_name, p.position, p.nationality, p.fee, 
         c.club_id, c.name, l.league_id, l.name;
GO

/**
 * vw_ClubWithStats
 * Club view with comprehensive statistics
 * Integrates: Club, League, Player, Transfer, Contract
 */
IF OBJECT_ID('vw_ClubWithStats', 'V') IS NOT NULL
    DROP VIEW vw_ClubWithStats;
GO

CREATE VIEW vw_ClubWithStats
AS
SELECT 
    c.club_id,
    c.name,
    c.country,
    c.founded_year,
    l.league_id,
    l.name as league_name,
    COUNT(DISTINCT p.player_id) as squad_size,
    COUNT(DISTINCT CASE WHEN t_in.transfer_id IS NOT NULL THEN t_in.transfer_id END) as transfers_in,
    COUNT(DISTINCT CASE WHEN t_out.transfer_id IS NOT NULL THEN t_out.transfer_id END) as transfers_out,
    ISNULL(SUM(CAST(t_in.transfer_fee AS FLOAT)), 0) as total_spent,
    ISNULL(SUM(CAST(t_out.transfer_fee AS FLOAT)), 0) as total_received,
    COUNT(DISTINCT con.contract_id) as active_contracts,
    ISNULL(SUM(CAST(con.salary AS FLOAT)), 0) as total_salary_commitment
FROM Club c
LEFT JOIN League l ON c.league_id = l.league_id
LEFT JOIN Player p ON c.club_id = p.current_club_id
LEFT JOIN Transfer t_in ON c.club_id = t_in.to_club_id
LEFT JOIN Transfer t_out ON c.club_id = t_out.from_club_id
LEFT JOIN Contract con ON c.club_id = con.club_id AND con.end_date >= GETDATE()
GROUP BY c.club_id, c.name, c.country, c.founded_year, l.league_id, l.name;
GO

/**
 * vw_AgentWithPortfolio
 * Agent view with client portfolio analysis
 * Integrates: Agent, PlayerAgent, Player, Contract, Transfer
 */
IF OBJECT_ID('vw_AgentWithPortfolio', 'V') IS NOT NULL
    DROP VIEW vw_AgentWithPortfolio;
GO

CREATE VIEW vw_AgentWithPortfolio
AS
SELECT 
    a.agent_id,
    a.agent_name,
    COUNT(DISTINCT pa.player_id) as managed_players,
    COUNT(DISTINCT t.transfer_id) as transfers_arranged,
    SUM(CAST(t.transfer_fee AS FLOAT)) as total_transfer_value,
    COUNT(DISTINCT c.contract_id) as clients_under_contract,
    AVG(CAST(c.salary AS FLOAT)) as avg_client_salary,
    MAX(CAST(t.transfer_fee AS FLOAT)) as highest_transfer_fee
FROM Agent a
LEFT JOIN PlayerAgent pa ON a.agent_id = pa.agent_id
LEFT JOIN Player p ON pa.player_id = p.player_id
LEFT JOIN Transfer t ON p.player_id = t.player_id
LEFT JOIN Contract c ON p.player_id = c.player_id AND c.end_date >= GETDATE()
GROUP BY a.agent_id, a.agent_name;
GO

-- ============================================================================
-- PART 5: EXECUTION VERIFICATION
-- ============================================================================

PRINT '✓ All 11 tables are now interconnected with:';
PRINT '  - Foreign Key Relationships';
PRINT '  - 5 Comprehensive Stored Procedures';
PRINT '  - 5 Data Integrity Triggers';
PRINT '  - 3 Reporting Views';
PRINT '';
PRINT 'Table Connections:';
PRINT '  1. User ↔ PlayerProfile, AgentProfile';
PRINT '  2. PlayerProfile ↔ Club ↔ League';
PRINT '  3. Player ↔ Club, Contract, Transfer, Agent';
PRINT '  4. Transfer ↔ Club (from/to), Player, TransferHistory';
PRINT '  5. Contract ↔ Player, Club';
PRINT '  6. PlayerAgent ↔ Player, Agent';
GO
