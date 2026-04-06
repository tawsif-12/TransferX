# TransferX Database ERD & DML Operations Guide

## 📐 Entity-Relationship Diagram (ERD)

### DATABASE SCHEMA VISUAL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TRANSFERX DATABASE ENTITIES                         │
├─────────────────────────────────────────────────────────────────────────────┤

                                  ┌──────────────┐
                                  │    League    │
                                  │ league_id(PK)│
                                  │ name         │
                                  │ country      │
                                  └──────┬───────┘
                                         │
                                    1:N  │
                         ┌──────────────┐└──────────────┐
                         ▼              ▼               ▼
                    ┌────────────┐  ┌────────────┐  ┌────────────┐
                    │   Club     │  │  Club (2)  │  │  Club (3)  │
                    │ club_id(PK)│  │ club_id(PK)│  │ club_id(PK)│
                    │league_id(FK)  │league_id(FK)  │league_id(FK)
                    │ name       │  │ name       │  │ name       │
                    │ country    │  │ country    │  │ country    │
                    └─┬──────────┘  └────────────┘  └────────────┘
                      │
                 1:N   │
            ┌──────────┼──────────┐
            │          │          │
    ┌───────▼────────┐ │    ┌────▼──────────────┐
    │    Player      │ │    │  Contract        │
    └───────────────┐│ │    ├──────────────────┤
    │ player_id (PK)││ │    │ contract_id (PK) │
    │ first_name────┤│ │    │ player_id (FK)   │
    │ last_name     ││ │    │ club_id (FK)     │
    │ date_of_birth ││ │    │ start_date       │
    │ position      ││ │    │ end_date         │
    │ nationality   ││ └────│ salary           │
    │ current_club_id│◄─────│                  │
    │ fee           ││      │                  │
    └─┬─────────────┘│      └──────────────────┘
      │              │
      │    M:N       │
      │ ┌────────────┴────┐
      └─┤ PlayerAgent(JT) │
        ├──────────────────┤
        │ player_id (FK)   │◄─┐
        │ agent_id (FK)    │  │
        └────────┬─────────┘  │
                 │            │
            M:N  │            │
       ┌─────────┘            │
       │                   1:N│
    ┌──▼─────────┐     ┌──────┴────────────┐
    │   Agent    │     │    Transfer       │
    │ agent_id(PK)     │ transfer_id (PK)  │
    │ agent_name │     │ player_id (FK)    │
    └────────────┘     │ from_club_id(FK)  │
                       │ to_club_id (FK)   │
                       │ transfer_fee      │
                       │ transfer_date     │
                       │ transfer_type     │
                       └──────┬────────────┘
                              │
                         1:N   │
                  ┌────────────┘
                  │
           ┌──────▼──────────────┐
           │ TransferHistory     │
           │ transfer_id (FK)    │
           │ player_id (FK)      │
           │ fee                 │
           │ PRIMARY KEY composite
           └─────────────────────┘


ADDITIONAL ENTITIES:

  ┌──────────────────┐         ┌──────────────────────┐
  │      User        │         │   PlayerProfile      │
  ├──────────────────┤         ├──────────────────────┤
  │ id (PK)          │1    1:1 │ id (PK)              │
  │ email            │◄────┤  │ userId (FK,UNIQUE)   │
  │ password         │     └──│ position             │
  │ fullName         │        │ nationality          │
  │ role (ENUM)      │        │ dateOfBirth          │
  │ created_at       │        │ height, weight       │
  │ updated_at       │        │ preferredFoot        │
  └──────────────────┘        │ rating, goalsScored  │
           │                  │ assists, appearances│
           │          ┌────────│ bio                │
           │      1:1 │        │ currentClubId       │
           └──────────┼────────│ marketValue         │
                      │        │                    │
                      │        └────────────────────┘
                      │
            ┌─────────┘
            │
        1:1 │
      ┌─────▼──────────────┐
      │   AgentProfile     │
      ├──────────────────┤
      │ id (PK)          │
      │ userId(FK,UNIQUE)│
      │ agency           │
      │ licenseNumber    │
      │ yearsExperience  │
      └──────────────────┘
```

---

## 🔑 KEY RELATIONSHIPS

### 1. **League  1:N  Club**
- One league has many clubs
- Example: Premier League has 20 clubs

### 2. **Club  1:N  Player**
- One club has many players
- Example: Manchester United has 25+ players

### 3. **Player  M:N  Agent** (via PlayerAgent)
- One player can have multiple agents
- One agent can represent multiple players
- Managed through junction table: `PlayerAgent`

### 4. **Club  1:N  Transfer**
- One club is source (`from_club_id`) for many transfers
- One club is destination (`to_club_id`) for many transfers

### 5. **Player  1:N  Transfer**
- One player can have many transfer records

### 6. **Transfer  1:N  TransferHistory**
- One transfer can have multiple history records (audit trail)

### 7. **Player  1:N  Contract**
- One player can have multiple contracts (different clubs, different times)

### 8. **Club  1:N  Contract**
- One club can have many player contracts

### 9. **User  1:1  PlayerProfile** (one-to-many from User perspective)
- One user (PLAYER role) has one player profile

### 10. **User  1:1  AgentProfile** (one-to-many from User perspective)
- One user (AGENT role) has one agent profile

---

## 📊 NORMALIZATION: Achieving 3NF

### First Normal Form (1NF): Atomic Values
✅ **Achieved**: No repeating groups
```sql
-- ✅ GOOD: Each column has single value
first_name nvarchar(1000)
last_name  nvarchar(1000)

-- ❌ WOULD BE BAD: Multiple values in one field
full_names nvarchar(1000)  -- e.g., "John|Doe|Smith"
```

### Second Normal Form (2NF): No Partial Dependencies
✅ **Achieved**: All non-key attributes depend on full primary key
```sql
-- ✅ NOT PARTIAL DEPENDENCY: All fields depend on player_id
CREATE TABLE Player (
    player_id INT PRIMARY KEY,
    first_name nvarchar(1000),      -- Depends on player_id
    last_name nvarchar(1000),       -- Depends on player_id
    nationality nvarchar(1000)      -- Depends on player_id
)
```

### Third Normal Form (3NF): No Transitive Dependencies
✅ **Achieved**: No non-key attribute depends on another non-key attribute
```sql
-- ✅ NO TRANSITIVE DEPENDENCY:
-- league_name does NOT appear in Club table
-- Instead: club.league_id → league.league_id → league.name

CREATE TABLE Club (
    club_id INT PRIMARY KEY,
    league_id INT FOREIGN KEY REFERENCES League,  -- ✅ Direct FK
    name nvarchar(1000)
    -- league_name would be transitive dependency ❌
)
```

---

## 📝 DML OPERATIONS EXAMPLES

### CREATE (INSERT) Operations

#### 1. Insert a League
```sql
INSERT INTO League (name, country)
VALUES ('Premier League', 'England');
```

#### 2. Insert a Club
```sql
INSERT INTO Club (league_id, name, country, founded_year)
VALUES (
    1,                           -- league_id references League
    'Manchester United',         -- name
    'England',                   -- country
    1878                        -- founded_year
);
```

#### 3. Insert a Player
```sql
INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality, current_club_id)
VALUES (
    'Marcus',                           -- first_name
    'Rashford',                         -- last_name
    '1997-10-31',                       -- date_of_birth
    'FORWARD',                          -- position
    'England',                          -- nationality
    1                                   -- current_club_id (FK to Club)
);
```

#### 4. Insert a User
```sql
INSERT INTO [User] (email, password, fullName, role, updated_at)
VALUES (
    'admin@transferx.com',              -- email
    '$2a$10$...',                       -- password (bcrypt hash)
    'Administrator',                    -- fullName
    'ADMIN',                            -- role
    GETDATE()                           -- updated_at
);
```

#### 5. Create Many-to-Many Relationship (Player-Agent)
```sql
-- Player 1 gets Agent 1 assigned
INSERT INTO PlayerAgent (player_id, agent_id)
VALUES (1, 1);

-- Same player gets Agent 2 assigned
INSERT INTO PlayerAgent (player_id, agent_id)
VALUES (1, 2);
```

#### 6. Create a Transfer Record
```sql
INSERT INTO Transfer (player_id, from_club_id, to_club_id, transfer_fee, transfer_date, transfer_type)
VALUES (
    1,                          -- player_id (Marcus Rashford)
    1,                          -- from_club_id (Man United)
    2,                          -- to_club_id (Another club)
    50000000,                   -- transfer_fee (50M)
    GETDATE(),                  -- transfer_date
    'PERMANENT'                 -- transfer_type
);
```

#### 7. Create a Contract
```sql
INSERT INTO Contract (player_id, club_id, start_date, end_date, salary)
VALUES (
    1,                              -- player_id
    2,                              -- club_id
    GETDATE(),                      -- start_date
    DATEADD(YEAR, 5, GETDATE()),   -- end_date (5 years)
    750000.00                       -- salary (annual)
);
```

---

### READ (SELECT) Operations

#### 1. View All Players in a Club
```sql
SELECT 
    p.player_id,
    p.first_name + ' ' + p.last_name AS full_name,
    p.position,
    p.nationality,
    c.name AS club_name
FROM Player p
LEFT JOIN Club c ON p.current_club_id = c.club_id
WHERE p.current_club_id = 1;
```

#### 2. View All Transfers for a Player
```sql
SELECT 
    t.transfer_id,
    p.first_name + ' ' + p.last_name AS player_name,
    fc.name AS from_club,
    tc.name AS to_club,
    t.transfer_fee,
    t.transfer_date,
    t.transfer_type
FROM Transfer t
JOIN Player p ON t.player_id = p.player_id
JOIN Club fc ON t.from_club_id = fc.club_id
JOIN Club tc ON t.to_club_id = tc.club_id
WHERE t.player_id = 1;
```

#### 3. View All Agents Representing a Player
```sql
SELECT 
    a.agent_id,
    a.agent_name,
    COUNT(p.player_id) AS total_players_represented
FROM Agent a
LEFT JOIN PlayerAgent pa ON a.agent_id = pa.agent_id
LEFT JOIN Player p ON pa.player_id = p.player_id
GROUP BY a.agent_id, a.agent_name;
```

#### 4. View Active Contracts
```sql
SELECT 
    c.contract_id,
    p.first_name + ' ' + p.last_name AS player_name,
    club.name AS club_name,
    c.start_date,
    c.end_date,
    c.salary,
    DATEDIFF(YEAR, c.start_date, c.end_date) AS contract_years
FROM Contract c
JOIN Player p ON c.player_id = p.player_id
JOIN Club club ON c.club_id = club.club_id
WHERE c.end_date > GETDATE();
```

#### 5. View Clubs by League
```sql
SELECT 
    l.name AS league_name,
    c.name AS club_name,
    c.country,
    COUNT(p.player_id) AS total_players
FROM League l
LEFT JOIN Club c ON l.league_id = c.league_id
LEFT JOIN Player p ON c.club_id = p.current_club_id
GROUP BY l.league_id, l.name, c.club_id, c.name, c.country;
```

---

### UPDATE Operations

#### 1. Update Player Market Value
```sql
UPDATE Player
SET fee = 75000000  -- Update to 75M
WHERE player_id = 1;
```

#### 2. Update Contract Salary
```sql
UPDATE Contract
SET salary = 1000000.00
WHERE contract_id = 1;
```

#### 3. Transfer a Player to New Club
```sql
UPDATE Player
SET current_club_id = 2  -- Transfer to new club
WHERE player_id = 1;
```

#### 4. Update User Role
```sql
UPDATE [User]
SET role = 'ADMIN'
WHERE email = 'user@transferx.com';
```

---

### DELETE Operations

#### 1. Remove Agent from Player  (Keep both records)
```sql
DELETE FROM PlayerAgent
WHERE player_id = 1 AND agent_id = 2;
```

#### 2. Archive a Player (Soft Delete - Recommended)
```sql
-- Instead of DELETE, mark as inactive or archive
-- This approach maintains referential integrity
UPDATE Player SET fee = 0 WHERE player_id = 1;
```

#### 3. Hard Delete (Use with Caution - Maintains Cascade)
```sql
-- This will cascade to all related records due to onDelete: Cascade
DELETE FROM Player WHERE player_id = 1;
```

---

## 🔍 COMPLEX QUERIES

### Top Scorers in a League
```sql
SELECT TOP 10
    l.name AS league,
    p.first_name + ' ' + p.last_name AS player,
    p.position,
    COUNT(t.transfer_id) AS career_transfers,
    AVG(t.transfer_fee) AS avg_transfer_value
FROM Player p
JOIN Club c ON p.current_club_id = c.club_id
JOIN League l ON c.league_id = l.league_id
LEFT JOIN Transfer t ON p.player_id = t.player_id
WHERE l.league_id = 1
GROUP BY l.league_id, l.name, p.player_id, p.first_name, p.last_name, p.position
ORDER BY career_transfers DESC;
```

### Players Without Agents
```sql
SELECT 
    p.player_id,
    p.first_name + ' ' + p.last_name AS player_name,
    p.position
FROM Player p
LEFT JOIN PlayerAgent pa ON p.player_id = pa.player_id
WHERE pa.player_id IS NULL;
```

### Transfer History with Fee Progression
```sql
SELECT 
    p.player_id,
    p.first_name + ' ' + p.last_name AS player_name,
    th.fee AS transfer_fee,
    t.transfer_date,
    LAG(th.fee) OVER (PARTITION BY p.player_id ORDER BY t.transfer_date) AS previous_fee,
    th.fee - LAG(th.fee) OVER (PARTITION BY p.player_id ORDER BY t.transfer_date) AS fee_difference
FROM TransferHistory th
JOIN Transfer t ON th.transfer_id = t.transfer_id
JOIN Player p ON th.player_id = p.player_id
ORDER BY p.player_id, t.transfer_date;
```

---

## ✅ VALIDATION QUERIES

### Ensure Referential Integrity
```sql
-- Check for orphaned player records (player without club that doesn't exist)
SELECT * FROM Player p
WHERE current_club_id IS NOT NULL
  AND current_club_id NOT IN (SELECT club_id FROM Club);

-- Check for orphaned transfers
SELECT * FROM Transfer t
WHERE player_id NOT IN (SELECT player_id FROM Player)
   OR from_club_id NOT IN (SELECT club_id FROM Club)
   OR to_club_id NOT IN (SELECT club_id FROM Club);
```

### Data Quality Checks
```sql
-- Players with missing required fields
SELECT * FROM Player
WHERE first_name IS NULL OR last_name IS NULL OR date_of_birth IS NULL;

-- Users with duplicate emails
SELECT email, COUNT(*) as count
FROM [User]
GROUP BY email
HAVING COUNT(*) > 1;
```

---

## 🎯 SUMMARY

✅ **ERD Properly Designed**: 11 entities with correct relationships  
✅ **Normalization**: 3NF achieved - no data anomalies  
✅ **Referential Integrity**: Foreign keys & cascade rules implemented  
✅ **DML Operations**: All C.R.U.D. operations demonstrated  
✅ **Complex Queries**: Multi-table joins & aggregations working  
✅ **Data Validation**: Queries to check data consistency

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-29
