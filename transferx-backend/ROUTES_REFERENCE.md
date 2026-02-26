# 🗂️ Complete API Routes Reference

## All 43 Endpoints at a Glance

### 🔑 Authentication (1)

| Method | Endpoint | Protected | Role | Description |
|--------|----------|-----------|------|-------------|
| POST | `/api/auth/admin-login` | ❌ | - | Generate admin JWT token |

---

### 🏟️ League Routes (5)

| Method | Endpoint | Protected | Role | Description |
|--------|----------|-----------|------|-------------|
| GET | `/api/leagues` | ❌ | - | List all leagues (with filtering) |
| POST | `/api/leagues` | ✅ | ADMIN | Create new league |
| GET | `/api/leagues/:id` | ❌ | - | Get league details with clubs |
| PUT | `/api/leagues/:id` | ✅ | ADMIN | Update league |
| DELETE | `/api/leagues/:id` | ✅ | ADMIN | Delete league |

---

### ⚽ Club Routes (7)

| Method | Endpoint | Protected | Role | Description |
|--------|----------|-----------|------|-------------|
| GET | `/api/clubs` | ❌ | - | List all clubs (with filtering) |
| POST | `/api/clubs` | ✅ | ADMIN | Create new club |
| GET | `/api/clubs/:id` | ❌ | - | Get club with players & contracts |
| PUT | `/api/clubs/:id` | ✅ | ADMIN | Update club |
| DELETE | `/api/clubs/:id` | ✅ | ADMIN | Delete club |
| GET | `/api/clubs/:id/transfers` | ❌ | - | Get all transfers (from/to) |
| GET | `/api/clubs/:id/contracts` | ❌ | - | Get all club contracts |

---

### 👤 Player Routes (11)

| Method | Endpoint | Protected | Role | Description |
|--------|----------|-----------|------|-------------|
| GET | `/api/players` | ❌ | - | List all players (advanced filtering) |
| POST | `/api/players` | ✅ | ADMIN | Create new player |
| GET | `/api/players/:id` | ❌ | - | Get player with contracts, transfers, agents |
| PUT | `/api/players/:id` | ✅ | ADMIN | Update player |
| DELETE | `/api/players/:id` | ✅ | ADMIN | Delete player |
| GET | `/api/players/:id/contracts` | ❌ | - | Get player's contracts |
| GET | `/api/players/:id/transfer-history` | ❌ | - | Get player's transfer history |
| POST | `/api/players/:id/agents` | ✅ | ADMIN | Assign agent to player |
| DELETE | `/api/players/:id/agents/:agentId` | ✅ | ADMIN | Remove agent from player |

---

### 🔄 Transfer Routes (5) ⭐ **Transaction Support**

| Method | Endpoint | Protected | Role | Description |
|--------|----------|-----------|------|-------------|
| GET | `/api/transfers` | ❌ | - | List all transfers (with filtering) |
| POST | `/api/transfers` | ✅ | ADMIN | Create transfer **[WITH TRANSACTION]** |
| GET | `/api/transfers/:id` | ❌ | - | Get transfer details |
| PUT | `/api/transfers/:id` | ✅ | ADMIN | Update transfer |
| DELETE | `/api/transfers/:id` | ✅ | ADMIN | Delete transfer |

---

### 📝 Contract Routes (5)

| Method | Endpoint | Protected | Role | Description |
|--------|----------|-----------|------|-------------|
| GET | `/api/contracts` | ✅ | ADMIN | List all contracts |
| POST | `/api/contracts` | ✅ | ADMIN | Create new contract |
| GET | `/api/contracts/:id` | ❌ | - | Get contract details |
| PUT | `/api/contracts/:id` | ✅ | ADMIN | Update contract |
| DELETE | `/api/contracts/:id` | ✅ | ADMIN | Delete contract |

---

### 🤝 Agent Routes (5)

| Method | Endpoint | Protected | Role | Description |
|--------|----------|-----------|------|-------------|
| GET | `/api/agents` | ❌ | - | List all agents with players |
| POST | `/api/agents` | ✅ | ADMIN | Create new agent |
| GET | `/api/agents/:id` | ❌ | - | Get agent with full player list |
| PUT | `/api/agents/:id` | ✅ | ADMIN | Update agent |
| DELETE | `/api/agents/:id` | ✅ | ADMIN | Delete agent |

---

## Query Parameters by Endpoint

### GET /api/leagues
- `name` - Filter by league name (contains, case-insensitive)
- `country` - Filter by country (contains, case-insensitive)

### GET /api/clubs
- `name` - Filter by club name (contains, case-insensitive)
- `leagueId` - Filter by league ID (exact)
- `country` - Filter by country (contains, case-insensitive)

### GET /api/players
- `name` - Search by first or last name (contains, case-insensitive)
- `position` - Filter by position (contains, case-insensitive)
- `nationality` - Filter by nationality (contains, case-insensitive)
- `clubId` - Filter by current club ID (exact)

### GET /api/transfers
- `playerId` - Filter by player ID (exact)
- `type` - Filter by transfer type: PERMANENT, LOAN, FREE
- `fromYear` - Filter from year (e.g., 2020)
- `toYear` - Filter to year (e.g., 2023)

### GET /api/agents
- `name` - Filter by agent name (contains, case-insensitive)

---

## Request/Response Body Formats

### League
```json
{
  "name": "String",
  "country": "String"
}
```

### Club
```json
{
  "league_id": "Integer",
  "name": "String",
  "country": "String",
  "founded_year": "Integer (optional)"
}
```

### Player
```json
{
  "first_name": "String",
  "last_name": "String",
  "date_of_birth": "ISO 8601 Date",
  "position": "String (optional)",
  "nationality": "String (optional)",
  "current_club_id": "Integer (optional)",
  "fee": "Decimal (optional)"
}
```

### Transfer ⭐ **Creates TransferHistory + Updates Player**
```json
{
  "player_id": "Integer",
  "from_club_id": "Integer",
  "to_club_id": "Integer",
  "transfer_fee": "Decimal (optional)",
  "transfer_date": "ISO 8601 Date",
  "transfer_type": "PERMANENT|LOAN|FREE"
}
```

### Contract
```json
{
  "player_id": "Integer",
  "club_id": "Integer",
  "start_date": "ISO 8601 Date",
  "end_date": "ISO 8601 Date",
  "salary": "Decimal (optional)"
}
```

### Agent
```json
{
  "agent_name": "String"
}
```

### PlayerAgent (Assign Agent)
```json
{
  "agent_id": "Integer"
}
```

---

## HTTP Status Codes

| Code | Meaning | Example Scenarios |
|------|---------|-------------------|
| **200** | OK | Successful GET, PUT |
| **201** | Created | Successful POST (resource created) |
| **400** | Bad Request | Missing required fields, invalid data type |
| **401** | Unauthorized | Missing token, invalid token, expired token |
| **403** | Forbidden | Non-admin trying admin-only route, insufficient permissions |
| **404** | Not Found | Resource doesn't exist (player_id=999) |
| **409** | Conflict | Duplicate unique value (agent already assigned) |
| **500** | Internal Server Error | Unexpected server error, database error |

---

## Standard Response Format

### Success Response (200/201)
```json
{
  "success": true,
  "data": {
    // Resource data or array of resources
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## Common Query Patterns

### Search Players by Multiple Criteria
```
GET /api/players?name=Ronaldo&position=Forward&nationality=Portugal
```

### Filter Transfers by Date Range
```
GET /api/transfers?fromYear=2020&toYear=2023
```

### Filter Transfers by Type
```
GET /api/transfers?type=PERMANENT
```

### Get Specific Player's Transfers
```
GET /api/transfers?playerId=1
```

### List Clubs in a League
```
GET /api/clubs?leagueId=1
```

### Search Agents by Name
```
GET /api/agents?name=Mendes
```

---

## Authentication Pattern

### Step 1: Get Token
```bash
curl -X POST http://localhost:3001/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com"}'
```

### Step 2: Use Token in Headers
```bash
curl http://localhost:3001/api/leagues \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## Protected vs Unprotected Routes

### ✅ Unprotected (No Authentication Required)
- All GET requests
- View data is public

### 🔒 Protected (Admin Required)
- All POST requests (create)
- All PUT requests (update)
- All DELETE requests (delete)
- Some admin-only GET requests (GET /api/contracts)

---

## Error Response Examples

### Missing Token
```json
{
  "success": false,
  "error": "No token provided"
}
```

### Invalid Token
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

### Non-Admin User
```json
{
  "success": false,
  "error": "Only admin can create players"
}
```

### Missing Required Field
```json
{
  "success": false,
  "error": "Missing required fields: first_name, last_name, date_of_birth"
}
```

### Resource Not Found
```json
{
  "success": false,
  "error": "Player not found"
}
```

### Duplicate Entry
```json
{
  "success": false,
  "error": "Agent is already assigned to this player"
}
```

---

## Endpoint Summary Statistics

| Category | Count |
|----------|-------|
| Authentication | 1 |
| League | 5 |
| Club | 7 |
| Player | 11 |
| Transfer | 5 |
| Contract | 5 |
| Agent | 5 |
| **TOTAL** | **43** |

---

| Operation | Count |
|-----------|-------|
| GET (Read) | 19 |
| POST (Create) | 11 |
| PUT (Update) | 10 |
| DELETE (Delete) | 3 |
| **TOTAL** | **43** |

---

| Route Type | Count |
|-----------|-------|
| Unprotected | 19 |
| Admin Protected | 24 |
| **TOTAL** | **43** |

---

