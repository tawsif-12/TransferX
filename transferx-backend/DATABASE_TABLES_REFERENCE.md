# TransferX Database Tables Reference

This document provides an overview of all tables created in the MSSQL database for the TransferX platform.

## Quick Overview

After running `npx prisma db push`, the following **9 tables** will be created:

| Table | Records | Purpose |
|-------|---------|---------|
| User | ~5 | User accounts for all roles |
| League | ~6 | Football leagues worldwide |
| Club | ~20 | Football clubs in various leagues |
| Player | ~30 | Player profiles and statistics |
| Agent | ~5 | Football agents |
| PlayerAgent | ~10 | Player-Agent relationships |
| Transfer | ~10 | Transfer records |
| TransferHistory | ~10 | Historical transfer data |
| Contract | ~20 | Player contracts with clubs |

---

## Detailed Table Structure

### 1. User Table
**Purpose**: Authentication and user management for all application users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | INT | PRIMARY KEY, AUTO INCREMENT | Unique user identifier |
| email | STRING | UNIQUE, INDEXED | User email (login) |
| password_hash | STRING | NOT NULL | Bcrypt hashed password |
| first_name | STRING | NULLABLE | User's first name |
| last_name | STRING | NULLABLE | User's last name |
| role | STRING | DEFAULT 'FAN', INDEXED | ADMIN, AGENT, CLUB_MANAGER, PLAYER, FAN |
| created_at | DATETIME | DEFAULT NOW | Account creation timestamp |
| updated_at | DATETIME | AUTO UPDATE | Last modification timestamp |

**Indexes**: `email`, `role`

**Sample Data After Seeding**:
- admin@transferx.com (ADMIN)
- player@example.com (PLAYER)
- agent@example.com (AGENT)
- manager@example.com (CLUB_MANAGER)
- fan@example.com (FAN)

---

### 2. League Table
**Purpose**: Football leagues/competitions worldwide

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| league_id | INT | PRIMARY KEY, AUTO INCREMENT | Unique league identifier |
| name | STRING | NOT NULL | League name (e.g., "Premier League") |
| country | STRING | NOT NULL, INDEXED | Country/Region |

**Indexes**: `country`

**Sample Data After Seeding**:
- Premier League (England)
- La Liga (Spain)
- Bundesliga (Germany)
- Serie A (Italy)
- Ligue 1 (France)
- MLS (USA)

---

### 3. Club Table
**Purpose**: Football clubs that can sign players

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| club_id | INT | PRIMARY KEY, AUTO INCREMENT | Unique club identifier |
| league_id | INT | FOREIGN KEY, INDEXED | Reference to League |
| name | STRING | NOT NULL | Club name |
| country | STRING | NOT NULL, INDEXED | Club's country |
| founded_year | INT | NULLABLE | Year club was founded |

**Relationships**:
- Belongs to `League` (Many-to-One)
- Has many `Players` (One-to-Many)
- Has many `Transfers` as from/to club (One-to-Many)
- Has many `Contracts` (One-to-Many)

**Indexes**: `league_id`, `country`

---

### 4. Player Table
**Purpose**: Player profiles with career information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| player_id | INT | PRIMARY KEY, AUTO INCREMENT | Unique player identifier |
| first_name | STRING | NOT NULL | Player's first name |
| last_name | STRING | NOT NULL | Player's last name |
| date_of_birth | DATETIME | NOT NULL | Birth date |
| position | STRING | NULLABLE | Playing position (GK, DF, MF, FW) |
| nationality | STRING | NULLABLE, INDEXED | Player's nationality |
| current_club_id | INT | FOREIGN KEY, NULLABLE, INDEXED | Current club (if any) |
| fee | DECIMAL | NULLABLE | Current market value/transfer fee |

**Relationships**:
- Belongs to `Club` (Many-to-One, optional)
- Has many `Transfers` (One-to-Many)
- Has many `TransferHistory` records (One-to-Many)
- Has many `Contracts` (One-to-Many)
- Has many `Agents` through `PlayerAgent` (Many-to-Many)

**Indexes**: `current_club_id`, `nationality`

---

### 5. Transfer Table
**Purpose**: Transfer transactions between clubs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| transfer_id | INT | PRIMARY KEY, AUTO INCREMENT | Unique transfer identifier |
| player_id | INT | FOREIGN KEY, INDEXED | Player being transferred |
| from_club_id | INT | FOREIGN KEY, INDEXED | Selling club |
| to_club_id | INT | FOREIGN KEY, INDEXED | Buying club |
| transfer_fee | DECIMAL | NULLABLE | Transfer fee amount |
| transfer_date | DATETIME | NOT NULL, INDEXED | Date of transfer |
| transfer_type | STRING | NOT NULL | PERMANENT, LOAN, FREE |

**Relationships**:
- Belongs to `Player` (Many-to-One)
- Belongs to `Club` as from_club (Many-to-One)
- Belongs to `Club` as to_club (Many-to-One)
- Has many `TransferHistory` records (One-to-Many)

**Indexes**: `player_id`, `from_club_id`, `to_club_id`, `transfer_date`

---

### 6. TransferHistory Table
**Purpose**: Historical record of player transfers (composite key table)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| transfer_id | INT | PRIMARY KEY (composite), FOREIGN KEY | Transfer reference |
| player_id | INT | PRIMARY KEY (composite), FOREIGN KEY, INDEXED | Player reference |
| fee | DECIMAL | NULLABLE | Historical fee amount |

**Relationships**:
- Belongs to `Transfer` (Many-to-One)
- Belongs to `Player` (Many-to-One)

**Indexes**: `player_id`

---

### 7. Contract Table
**Purpose**: Player contracts with clubs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| contract_id | INT | PRIMARY KEY, AUTO INCREMENT | Unique contract identifier |
| player_id | INT | FOREIGN KEY, INDEXED | Player under contract |
| club_id | INT | FOREIGN KEY, INDEXED | Club offering contract |
| start_date | DATETIME | NOT NULL, INDEXED | Contract start date |
| end_date | DATETIME | NOT NULL, INDEXED | Contract end date |
| salary | DECIMAL | NULLABLE | Annual salary |

**Relationships**:
- Belongs to `Player` (Many-to-One)
- Belongs to `Club` (Many-to-One)

**Indexes**: `player_id`, `club_id`, `start_date, end_date` (composite)

---

### 8. Agent Table
**Purpose**: Football agents who represent players

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| agent_id | INT | PRIMARY KEY, AUTO INCREMENT | Unique agent identifier |
| agent_name | STRING | NOT NULL, INDEXED | Agent's full name |

**Relationships**:
- Has many `Players` through `PlayerAgent` (Many-to-Many)

**Indexes**: `agent_name`

---

### 9. PlayerAgent Table
**Purpose**: Many-to-many junction table between players and agents

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| player_id | INT | PRIMARY KEY (composite), FOREIGN KEY | Player reference |
| agent_id | INT | PRIMARY KEY (composite), FOREIGN KEY, INDEXED | Agent reference |

**Relationships**:
- Belongs to `Player` (Many-to-One) - CASCADE DELETE
- Belongs to `Agent` (Many-to-One) - CASCADE DELETE

**Indexes**: `agent_id`

---

## Entity Relationship Diagram (Text)

```
League (1) ----< (N) Club
                      |
                      | (1)
                      |
                      v
                    (N) Player (N) >----< (N) Agent
                      |                    (via PlayerAgent)
                      | (1)
                      |
                      v
                    (N) Transfer
                      |
                      | (1)
                      |
                      v
                    (N) TransferHistory
                    
Club (1) ----< (N) Contract >---- (N) Player
```

---

## Key Relationships Summary

### One-to-Many Relationships
- **League → Clubs**: Each league has multiple clubs
- **Club → Players**: Each club has multiple players
- **Club → Transfers**: Each club can be in multiple transfers (as from/to)
- **Club → Contracts**: Each club can have multiple contracts
- **Player → Transfers**: Each player can have multiple transfers
- **Player → Contracts**: Each player can have multiple contracts
- **Transfer → TransferHistory**: Each transfer can have multiple history records

### Many-to-Many Relationships
- **Player ↔ Agent**: Players can have multiple agents, agents can represent multiple players
  - Junction table: `PlayerAgent`

---

## Database Constraints & Features

### Foreign Key Actions
- **ON DELETE CASCADE**: `PlayerAgent` table (if player or agent deleted, relationship removed)
- **ON DELETE NoAction**: Most relationships preserve referential integrity
- **ON DELETE SetNull**: `Player.current_club_id` (if club deleted, player's club set to NULL)

### Indexes for Performance
All foreign keys are indexed for query optimization:
- User: `email`, `role`
- League: `country`
- Club: `league_id`, `country`
- Player: `current_club_id`, `nationality`
- Transfer: `player_id`, `from_club_id`, `to_club_id`, `transfer_date`
- TransferHistory: `player_id`
- Contract: `player_id`, `club_id`, `[start_date, end_date]` (composite)
- Agent: `agent_name`
- PlayerAgent: `agent_id`

### Unique Constraints
- `User.email`: Each email must be unique

---

## Verifying Tables After Setup

### Using SQLCMD

```powershell
# List all tables
sqlcmd -S localhost\SQLEXPRESS -d transferx -E -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' ORDER BY TABLE_NAME"

# Count records in each table
sqlcmd -S localhost\SQLEXPRESS -d transferx -E -Q "SELECT 'User' as TableName, COUNT(*) as Records FROM [User] UNION ALL SELECT 'League', COUNT(*) FROM League UNION ALL SELECT 'Club', COUNT(*) FROM Club UNION ALL SELECT 'Player', COUNT(*) FROM Player UNION ALL SELECT 'Agent', COUNT(*) FROM Agent UNION ALL SELECT 'PlayerAgent', COUNT(*) FROM PlayerAgent UNION ALL SELECT 'Transfer', COUNT(*) FROM Transfer UNION ALL SELECT 'TransferHistory', COUNT(*) FROM TransferHistory UNION ALL SELECT 'Contract', COUNT(*) FROM Contract"
```

### Using Prisma Studio

```powershell
npx prisma studio
```

Opens browser at http://localhost:5555 to visually browse all tables and data.

---

## Sample Queries

### Get all players with their clubs and agents
```sql
SELECT 
    p.first_name + ' ' + p.last_name AS PlayerName,
    c.name AS CurrentClub,
    a.agent_name AS Agent
FROM Player p
LEFT JOIN Club c ON p.current_club_id = c.club_id
LEFT JOIN PlayerAgent pa ON p.player_id = pa.player_id
LEFT JOIN Agent a ON pa.agent_id = a.agent_id
ORDER BY p.last_name;
```

### Get all transfers with details
```sql
SELECT 
    p.first_name + ' ' + p.last_name AS PlayerName,
    fc.name AS FromClub,
    tc.name AS ToClub,
    t.transfer_fee AS Fee,
    t.transfer_date AS Date,
    t.transfer_type AS Type
FROM Transfer t
JOIN Player p ON t.player_id = p.player_id
JOIN Club fc ON t.from_club_id = fc.club_id
JOIN Club tc ON t.to_club_id = tc.club_id
ORDER BY t.transfer_date DESC;
```

### Get clubs by league with player count
```sql
SELECT 
    l.name AS League,
    c.name AS Club,
    COUNT(p.player_id) AS PlayerCount
FROM League l
JOIN Club c ON l.league_id = c.league_id
LEFT JOIN Player p ON c.club_id = p.current_club_id
GROUP BY l.name, c.name
ORDER BY l.name, c.name;
```

---

## Additional Resources

- **Prisma Schema**: `prisma/schema.prisma` - Full schema definition
- **Seed Script**: `prisma/seed.js` - Sample data generator
- **Setup Guide**: `MSSQL_SETUP_GUIDE.md` - Complete installation guide
- **API Reference**: `API_REFERENCE.md` - Endpoints using these tables

---

**Last Updated**: February 2026  
**Database Provider**: Microsoft SQL Server  
**ORM**: Prisma 5.22+
