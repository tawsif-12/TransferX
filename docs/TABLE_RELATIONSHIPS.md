# Database Table Relationships - Visual Guide

## 🎯 Complete Connection Map

```
                            ┌──────────────────┐
                            │     USER (1)     │
                            │  id (PK)         │
                            │  email, password │
                            │  fullName, role  │
                            └──────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              FK (1:1)        FK (1:1)        [Admin]
                    │              │
                    v              v
           ┌─────────────────┐  ┌──────────────┐
           │ PlayerProfile(2)│  │AgentProfile(3)│
           │ id (PK)         │  │ id (PK)       │
           │ userId (FK)     │  │ userId (FK)   │
           │ position        │  │ agency        │
           │ nationality     │  │ license#      │
           │ currentClubId──┐│  │ yearsExperience
           │ dateOfBirth    ││  │               │
           └─────────────────┘  └──────────────┘
                    │                    │
              FK←────┴────────┐          │
                                │        │
                               env      FK
                                │        │
                    ┌──────────────┐    │
                    │  CLUB (5)    │◄───┘
                    │  club_id(PK) │
     ┌──────────────┤  league_id   │
     │              │  name, country
     │              │  founded_year├┐
     │              └──────────────┘│
   FK│                    ▲         │
     │             ┌──────┘         │
     │        FK   │ (1:Many)       │PK
     │             │                │
     │        ┌────────────┐  ┌─────────────┐
     │        │ LEAGUE (4) │  │  PLAYER (6) │
     │        │ league_id  │  │ player_id   │
     └───────→│ name       │  │ first_name  │
              │ country    │  │ last_name   │
              └────────────┘  │ position    │
                               │ nationality │
                               │ date of birth
                               │ current_club_id─┐
                               │ fee             │
                               └─────────────────┘
                                │    │     │
                    ┌───────────┼────┼─────┼─────────┐
                    │           │    │     │         │
                  FK│           │    │   FK│         │
                    │           │    │     │       FK│
                Matches→        │    │     │         │
              (Many contracts) │    │     │     (Many agents)
                    │           │    │     │         │
                    v           v    v     v         v
              ┌────────────┐ ┌──────┐┌──────┐┌───────────────┐
              │CONTRACT(9) │ │TRANS ││TRANS-│  PLAYERAGENT(11)│
              │contract_id │ │FER(7)││HISTORY├────player_id   │
              │player_id──→│ │trans ││(8)   │──agent_id
              │club_id─────┼ │_id───┼ trans │
              │start_date  │ │from_ ││_id    │ ┌──────────────┐
              │end_date    │ │club_ ││player │─→│ AGENT (10)   │
              │salary      │ │id    ││_id    │  │ agent_id(PK) │
              └────────────┘ │to_  ││fee    │  │ agent_name   │
                           │ │club_ ││       │  └──────────────┘
                           │ │id    ││       │
                           │ │trans ││       │
                           │ │fer_  ││       │
                           │ │fee   ││       │
                           │ │trans ││       │
                           │ │fer_  ││       │
                           │ │date  ││       │
                           │ │trans ││       │
                           │ │fer_  ││       │
                           │ │type  ││       │
                           │ └──────┘└──────┘
                           └────────────────┘
                                    │
                            (Auto-created by trigger)
```

---

## 📊 Table Summary

| # | Table Name | PK | FK Connections | Purpose |
|----|------------|----|----|---------|
| 1 | User | id | - | User accounts (Player, Agent, Admin) |
| 2 | PlayerProfile | id | userId | Extended player profile from User |
| 3 | AgentProfile | id | userId | Extended agent profile from User |
| 4 | League | league_id | - | Sports leagues/competitions |
| 5 | Club | club_id | league_id | Football clubs |
| 6 | Player | player_id | current_club_id | Player records |
| 7 | Transfer | transfer_id | player_id, from_club_id, to_club_id | Transfer transactions |
| 8 | TransferHistory | (transfer_id, player_id) | transfer_id, player_id | Audit trail (auto-created) |
| 9 | Contract | contract_id | player_id, club_id | Employment contracts |
| 10 | Agent | agent_id | - | Agents/Managers |
| 11 | PlayerAgent | (player_id, agent_id) | player_id, agent_id | Many-to-many relationship |

---

## 🔗 Connection Types

### One-to-One (1:1)
```
User ───1:1──→ PlayerProfile
User ───1:1──→ AgentProfile
```
- Each user has at most one player profile
- Each user has at most one agent profile

### One-to-Many (1:Many)
```
League ───1:Many──→ Club
Club ───1:Many──→ Player
Club ───1:Many──→ Contract
Club ───1:Many──→ Transfer (Both From & To)
Player ───1:Many──→ Contract
Player ───1:Many──→ Transfer
Player ───1:Many──→ TransferHistory
Agent ───1:Many──→ PlayerAgent
```
- One league has many clubs
- One club can sign many players
- One club can have many contracts
- One club can engage in many transfers (buying and selling)
- One player can have multiple contracts (sequential)
- One player can have multiple transfers
- One player can have multiple agents

### Many-to-Many (Many:Many)
```
Player ───Many:Many──→ Agent
    via PlayerAgent table
```
- One player can have multiple agents
- One agent can represent multiple players

---

## 🎯 Data Flow Examples

### Example 1: Complete Player Journey
```
1. Create User (user_id = 5)
   ↓
2. Create PlayerProfile (connect User to Club)
   ↓
3. Create Player (assign to Club via current_club_id)
   ↓
4. Create Contract (Player ↔ Club employment)
   ↓
5. Assign Agent via PlayerAgent (Player ↔ Agent)
   ↓
6. Record Transfer (Old Club → New Club)
   ↓ [Trigger fires]
7. TransferHistory created automatically (Audit)
   ↓ [Trigger fires]
8. Player.current_club_id updated automatically
```

### Example 2: Club Analysis
```
Club (id=1) 
┌─ League (id=1) - Premier League
├─ Players (5 current)
├─ Contracts (5 active)
├─ Transfers In (30 lifetime)
├─ Transfers Out (25 lifetime)
└─ Net Spend (£50M)
```

### Example 3: Agent Portfolio
```
Agent (id=3) - "John Smith"
├─ Clients (8 players)
├─ Total Transfer Value (£200M)
├─ Active Contracts (6)
├─ Average Salary (£2M/year)
└─ Highest Transfer Fee (£35M)
```

---

## 📥 How Tables Feed Each Other

### Insert Operations (With Triggers)

```
INSERT into Transfer
    ↓
[Trigger: trg_ValidateTransferParticipants]
    ├─ Validates Player exists
    ├─ Validates From-Club exists
    ├─ Validates To-Club exists
    ├─ Updates Player.current_club_id ← To-Club
    ↓
[Trigger: trg_CreateTransferHistoryEntry]
    └─ Creates TransferHistory record
       (Audit trail)

INSERT into Contract
    ↓
[Trigger: trg_UpdatePlayerCurrentClub]
    └─ Updates Player.current_club_id
       (If newer than previous contract)

INSERT into PlayerAgent
    ↓
[Trigger: trg_EnforcePlayerAgentRelationship]
    ├─ Validates Player exists
    ├─ Validates Agent exists
    └─ Only then allows insert

DELETE from User
    ↓
[Trigger: trg_PreventOrphanedPlayerProfiles]
    ├─ Deletes PlayerProfile
    └─ Deletes AgentProfile
```

---

## 🔄 Query Path Examples

### To get player with all their data:
```
User (1)
  ↓ (via PlayerProfile.userId)
PlayerProfile (1)
  ↓ (via currentClubId)
Club (1)
  ↓ (via league_id)
League (1)

Player (1)
  ↓ (many relations)
├─ Contract (many)
│   └─ Club (1 per contract)
├─ Transfer (many)
│   ├─ From Club (1 per transfer)
│   ├─ To Club (1 per transfer)
│   └─ TransferHistory (1 per transfer)
└─ PlayerAgent (many)
    └─ Agent (1 per record)
```

**Covered by:** `sp_GetCompletePlayerProfile`

---

### To get club statistics:
```
Club (1)
├─ League (1)
├─ Player (many current)
├─ Contract (many)
├─ Transfer In (many)
│   └─ Player involved
├─ Transfer Out (many)
│   └─ Player involved
└─ Financial summary
```

**Covered by:** `sp_GetClubTransferWindow`

---

### To get agent performance:
```
Agent (1)
├─ PlayerAgent (many)
│   └─ Player (1 per record)
│       ├─ Transfer (many per player)
│       └─ Contract (many per player)
└─ Aggregated stats
```

**Covered by:** `sp_GetAgentPerformance`

---

## 🌐 Network Connectivity

```
Total Direct Connections: 13
├─ 1 User ↔ PlayerProfile
├─ 1 User ↔ AgentProfile  
├─ 1 PlayerProfile → Club
├─ 1 AgentProfile → Agent
├─ 1 League ↔ Club (Many)
├─ 1 Club ↔ Player (Many)
├─ 2 Club ↔ Transfer (Many, From/To)
├─ 1 Club ↔ Contract (Many)
├─ 1 Player ↔ Contract (Many)
├─ 1 Player ↔ Transfer (Many)
├─ 1 Player ↔ TransferHistory (Many)
├─ 1 Player ↔ PlayerAgent (Many:Many)
└─ 1 Agent ↔ PlayerAgent (Many)

Total Indirect Connections (via joins): 20+
```

---

## 📍 Relationship Cardinality Summary

```
     1       :       Many
├─────────────────────────┤
User       :    PlayerProfile
League     :    Club
Club       :    Player
Club       :    Contract
Club       :    Transfer
Player     :    Transfer
Player     :    Contract
Player     :    TransferHistory
Agent      :    PlayerAgent

Many       :       Many
├─────────────────────────┤
Player     :    Agent
             (via PlayerAgent)
```

---

## 🔐 Referential Integrity Enforcement

### Cascade Delete
```
DELETE User
  → Cascade delete PlayerProfile
  → Cascade delete AgentProfile
```

### Prevent Orphaned Records
```
INSERT PlayerAgent with invalid Player
  → REJECTED (Trigger validation)

INSERT PlayerAgent with invalid Agent
  → REJECTED (Trigger validation)
```

### Automatic Updates
```
INSERT Transfer
  → Player.current_club_id AUTO UPDATED

INSERT Contract
  → Player.current_club_id AUTO UPDATED
```

### Audit Trail
```
INSERT Transfer
  → TransferHistory AUTO CREATED
```

---

## 📈 Relationship Strength Analysis

| Relationship | Strength | Type | Consistency |
|--------------|----------|------|-------------|
| User ↔ PlayerProfile | Strong | Mandatory | PK/FK |
| Club ↔ League | Strong | Mandatory | PK/FK |
| Player ↔ Club | Moderate | Optional | FK with SET NULL |
| Transfer (From/To) ↔ Club | Strong | Mandatory | PK/FK |
| Contract ↔ Player/Club | Strong | Mandatory | PK/FK |
| PlayerAgent ↔ Player/Agent | Strong | Mandatory | PK/FK |
| Transfer ↔ TransferHistory | Strong | Mandatory | PK/FK (Auto) |

---

## ✅ All Tables: Connected & Verified

```
[✓] Table 1:  User             - Connected to PlayerProfile, AgentProfile
[✓] Table 2:  PlayerProfile    - Connected to User, Club  
[✓] Table 3:  AgentProfile     - Connected to User, Agent
[✓] Table 4:  League           - Connected to Club
[✓] Table 5:  Club             - Connected to League, Player, Transfer, Contract
[✓] Table 6:  Player           - Connected to Club, Contract, Transfer, PlayerAgent
[✓] Table 7:  Transfer         - Connected to Player, Club (2), TransferHistory
[✓] Table 8:  TransferHistory  - Connected to Transfer, Player
[✓] Table 9:  Contract         - Connected to Player, Club
[✓] Table 10: Agent            - Connected to PlayerAgent
[✓] Table 11: PlayerAgent      - Connected to Player, Agent

STATUS: All 11 tables fully interconnected! ✅
```

---

**Visual Guide Created:** April 4, 2026
**Database Design:** Star & Snowflake Schema Hybrid
**Connectivity:** 100% of tables connected
