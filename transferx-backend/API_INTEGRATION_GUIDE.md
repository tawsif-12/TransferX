# TransferX API Documentation - PART 2: Prisma Integration

This document provides complete API reference for the TransferX backend with integrated Prisma ORM and MSSQL database.

## Authentication Setup

### 1. Get Admin Token
Before making any admin requests, get a JWT token:

**Endpoint:** `POST /api/auth/admin-login`

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "ADMIN",
    "email": "admin@example.com",
    "message": "Admin token generated successfully. Use this token in Authorization header as: Bearer <token>"
  }
}
```

### 2. Use Token in Requests
Include the token in the Authorization header:

```bash
Authorization: Bearer <your_token_here>
```

---

## API Endpoints

### LEAGUE ENDPOINTS

#### GET All Leagues
**Endpoint:** `GET /api/leagues`

**Query Parameters:**
- `name` (optional): Filter by league name
- `country` (optional): Filter by country

**Example:**
```bash
curl http://localhost:3001/api/leagues?country=England
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "league_id": 1,
      "name": "Premier League",
      "country": "England",
      "clubs": [...]
    }
  ]
}
```

#### GET League by ID
**Endpoint:** `GET /api/leagues/:id`

**Example:**
```bash
curl http://localhost:3001/api/leagues/1
```

#### POST Create League (Admin)
**Endpoint:** `POST /api/leagues`

**Request:**
```bash
curl -X POST http://localhost:3001/api/leagues \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "La Liga",
    "country": "Spain"
  }'
```

#### PUT Update League (Admin)
**Endpoint:** `PUT /api/leagues/:id`

**Request:**
```bash
curl -X PUT http://localhost:3001/api/leagues/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "English Premier League",
    "country": "England"
  }'
```

#### DELETE League (Admin)
**Endpoint:** `DELETE /api/leagues/:id`

```bash
curl -X DELETE http://localhost:3001/api/leagues/1 \
  -H "Authorization: Bearer <token>"
```

---

### CLUB ENDPOINTS

#### GET All Clubs
**Endpoint:** `GET /api/clubs`

**Query Parameters:**
- `name` (optional): Filter by club name
- `leagueId` (optional): Filter by league
- `country` (optional): Filter by country

**Example:**
```bash
curl http://localhost:3001/api/clubs?leagueId=1
```

#### GET Club by ID (with players and contracts)
**Endpoint:** `GET /api/clubs/:id`

**Example:**
```bash
curl http://localhost:3001/api/clubs/1
```

**Response includes:**
- Club details
- League information
- All players currently at the club
- All active contracts

#### GET Club Transfers
**Endpoint:** `GET /api/clubs/:id/transfers`

Returns all transfers where this club is either from_club or to_club.

**Example:**
```bash
curl http://localhost:3001/api/clubs/1/transfers
```

#### GET Club Contracts
**Endpoint:** `GET /api/clubs/:id/contracts`

**Example:**
```bash
curl http://localhost:3001/api/clubs/1/contracts
```

#### POST Create Club (Admin)
**Endpoint:** `POST /api/clubs`

**Request:**
```bash
curl -X POST http://localhost:3001/api/clubs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "league_id": 1,
    "name": "Chelsea FC",
    "country": "England",
    "founded_year": 1905
  }'
```

#### PUT Update Club (Admin)
**Endpoint:** `PUT /api/clubs/:id`

#### DELETE Club (Admin)
**Endpoint:** `DELETE /api/clubs/:id`

---

### PLAYER ENDPOINTS

#### GET All Players (with filtering)
**Endpoint:** `GET /api/players`

**Query Parameters:**
- `name` (optional): Search by first or last name
- `position` (optional): Filter by position
- `nationality` (optional): Filter by nationality
- `clubId` (optional): Filter by current club

**Examples:**
```bash
# Search by name
curl http://localhost:3001/api/players?name=Ronaldo

# Filter by position
curl http://localhost:3001/api/players?position=Forward

# Filter by club
curl http://localhost:3001/api/players?clubId=1

# Multiple filters
curl "http://localhost:3001/api/players?nationality=Portugal&position=Forward"
```

#### GET Player by ID (with contracts, transfers, agents)
**Endpoint:** `GET /api/players/:id`

**Example:**
```bash
curl http://localhost:3001/api/players/1
```

**Response includes:**
- Player details
- Current club information
- All contracts with dates and salary
- Complete transfer history
- Associated agents

#### GET Player Transfer History
**Endpoint:** `GET /api/players/:id/transfer-history`

Returns all transfers for the player ordered by most recent first.

**Example:**
```bash
curl http://localhost:3001/api/players/1/transfer-history
```

#### GET Player Contracts
**Endpoint:** `GET /api/players/:id/contracts`

**Example:**
```bash
curl http://localhost:3001/api/players/1/contracts
```

#### POST Create Player (Admin)
**Endpoint:** `POST /api/players`

**Request:**
```bash
curl -X POST http://localhost:3001/api/players \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Lionel",
    "last_name": "Messi",
    "date_of_birth": "1987-06-24",
    "position": "Forward",
    "nationality": "Argentina",
    "current_club_id": 2,
    "fee": 50.5
  }'
```

#### PUT Update Player (Admin)
**Endpoint:** `PUT /api/players/:id`

#### DELETE Player (Admin)
**Endpoint:** `DELETE /api/players/:id`

---

### TRANSFER ENDPOINTS (Key Transaction Example)

#### GET All Transfers (with filtering)
**Endpoint:** `GET /api/transfers`

**Query Parameters:**
- `playerId` (optional): Filter by player
- `type` (optional): Filter by transfer type (PERMANENT, LOAN, FREE)
- `fromYear` (optional): Filter by year range start
- `toYear` (optional): Filter by year range end

**Examples:**
```bash
# Get all permanent transfers
curl http://localhost:3001/api/transfers?type=PERMANENT

# Get transfers from 2020-2023
curl "http://localhost:3001/api/transfers?fromYear=2020&toYear=2023"

# Get all transfers for a player
curl http://localhost:3001/api/transfers?playerId=1
```

#### GET Transfer by ID
**Endpoint:** `GET /api/transfers/:id`

#### POST Create Transfer (Admin) - **WITH TRANSACTION**
**Endpoint:** `POST /api/transfers`

**Important:** This endpoint uses Prisma transaction to:
1. Create Transfer record
2. Create TransferHistory entry
3. Update Player's current_club_id

**Request:**
```bash
curl -X POST http://localhost:3001/api/transfers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "player_id": 1,
    "from_club_id": 2,
    "to_club_id": 1,
    "transfer_fee": 120.5,
    "transfer_date": "2023-03-15",
    "transfer_type": "PERMANENT"
  }'
```

**Transaction Process (backend):**
```javascript
const transfer = await prisma.$transaction(async (tx) => {
  // 1. Create transfer
  const newTransfer = await tx.transfer.create({...});
  
  // 2. Create transfer history
  await tx.transferHistory.create({
    transfer_id: newTransfer.transfer_id,
    player_id: playerId,
    fee: transfer_fee
  });
  
  // 3. Update player's current club
  await tx.player.update({
    where: { player_id: playerId },
    data: { current_club_id: toClubId }
  });
  
  return newTransfer;
});
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transfer_id": 1,
    "player_id": 1,
    "from_club_id": 2,
    "to_club_id": 1,
    "transfer_fee": "120.50",
    "transfer_date": "2023-03-15T00:00:00.000Z",
    "transfer_type": "PERMANENT",
    "player": {...},
    "from_club": {...},
    "to_club": {...}
  }
}
```

#### PUT Update Transfer (Admin)
**Endpoint:** `PUT /api/transfers/:id`

#### DELETE Transfer (Admin)
**Endpoint:** `DELETE /api/transfers/:id`

---

### CONTRACT ENDPOINTS

#### GET All Contracts (Admin only)
**Endpoint:** `GET /api/contracts`

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/contracts
```

#### GET Player Contracts
**Endpoint:** `GET /api/players/:id/contracts`

#### GET Club Contracts
**Endpoint:** `GET /api/clubs/:id/contracts`

#### GET Contract by ID
**Endpoint:** `GET /api/contracts/:id`

#### POST Create Contract (Admin)
**Endpoint:** `POST /api/contracts`

**Request:**
```bash
curl -X POST http://localhost:3001/api/contracts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "player_id": 1,
    "club_id": 1,
    "start_date": "2023-03-15",
    "end_date": "2025-03-14",
    "salary": 500000
  }'
```

#### PUT Update Contract (Admin)
**Endpoint:** `PUT /api/contracts/:id`

#### DELETE Contract (Admin)
**Endpoint:** `DELETE /api/contracts/:id`

---

### AGENT ENDPOINTS

#### GET All Agents (with players)
**Endpoint:** `GET /api/agents`

**Query Parameters:**
- `name` (optional): Filter by agent name

**Example:**
```bash
curl http://localhost:3001/api/agents?name=Mendes
```

#### GET Agent by ID (with full player list)
**Endpoint:** `GET /api/agents/:id`

**Example:**
```bash
curl http://localhost:3001/api/agents/1
```

#### POST Create Agent (Admin)
**Endpoint:** `POST /api/agents`

**Request:**
```bash
curl -X POST http://localhost:3001/api/agents \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_name": "Jorge Mendes"
  }'
```

#### PUT Update Agent (Admin)
**Endpoint:** `PUT /api/agents/:id`

#### DELETE Agent (Admin)
**Endpoint:** `DELETE /api/agents/:id`

---

### PLAYER-AGENT ENDPOINTS

#### POST Assign Agent to Player (Admin)
**Endpoint:** `POST /api/players/:id/agents`

Creates a many-to-many relationship between player and agent.

**Request:**
```bash
curl -X POST http://localhost:3001/api/players/1/agents \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": 1
  }'
```

#### DELETE Remove Agent from Player (Admin)
**Endpoint:** `DELETE /api/players/:id/agents/:agentId`

**Request:**
```bash
curl -X DELETE http://localhost:3001/api/players/1/agents/1 \
  -H "Authorization: Bearer <token>"
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* actual data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing the issue"
}
```

---

## HTTP Status Codes

- `200`: Success (GET, PUT)
- `201`: Created (POST)
- `400`: Bad Request (validation errors, missing fields)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions, admin-only route without ADMIN role)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (duplicate unique value)
- `500`: Internal Server Error

---

## Key Features

✅ **Singleton Prisma Client** - Prevents multiple instances in development
✅ **Transaction Support** - Transfer creation atomically creates Transfer + TransferHistory + updates Player
✅ **JWT Authentication** - Token-based auth with role-based access control
✅ **Admin Middleware** - Role verification for protected routes
✅ **Comprehensive Filtering** - Search and filter by multiple criteria
✅ **Cascading Deletes** - Proper referential integrity with database constraints
✅ **Type-Safe Queries** - Full Prisma Client type safety
✅ **Error Handling** - Standardized error responses with appropriate HTTP codes

---

## Example Complete Workflow

```javascript
// 1. Get admin token
POST /api/auth/admin-login
{
  "email": "admin@example.com"
}
// Returns: { token: "..." }

// 2. Create league
POST /api/leagues
Authorization: Bearer <token>
{
  "name": "Premier League",
  "country": "England"
}
// Returns: { league_id: 1, ... }

// 3. Create clubs
POST /api/clubs
Authorization: Bearer <token>
{
  "league_id": 1,
  "name": "Manchester United",
  "country": "England",
  "founded_year": 1878
}
// Returns: { club_id: 1, ... }

// 4. Create player
POST /api/players
Authorization: Bearer <token>
{
  "first_name": "Cristiano",
  "last_name": "Ronaldo",
  "date_of_birth": "1985-02-05",
  "position": "Forward",
  "nationality": "Portugal",
  "current_club_id": 1,
  "fee": 120.5
}
// Returns: { player_id: 1, ... }

// 5. Create transfer (with transaction)
POST /api/transfers
Authorization: Bearer <token>
{
  "player_id": 1,
  "from_club_id": 2,
  "to_club_id": 1,
  "transfer_fee": 120.5,
  "transfer_date": "2023-03-15",
  "transfer_type": "PERMANENT"
}
// Returns: { transfer_id: 1, ... }
// Automatically creates TransferHistory and updates player's current_club_id

// 6. Get player with full details
GET /api/players/1
// Returns: player with contracts, transfers, and agents

// 7. Get club transfers
GET /api/clubs/1/transfers
// Returns: all transfers involving this club
```

---

## Development Notes

- All timestamps are in ISO 8601 format (UTC)
- Decimal fields use string representation to preserve precision
- Composite keys are properly handled for TransferHistory and PlayerAgent
- Database uses MSSQL with Prisma ORM
- No raw SQL queries - all operations use Prisma Client
