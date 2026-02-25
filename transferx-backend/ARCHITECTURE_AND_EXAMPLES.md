# TransferX - Complete Architecture & Code Examples

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React/Vite)                     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Next.js API Routes                         │
├─────────────────────────────────────────────────────────────┤
│  Route Handlers (43 endpoints)                              │
│  ├─ Auth Routes     (1)                                     │
│  ├─ League Routes   (5)                                     │
│  ├─ Club Routes     (7)                                     │
│  ├─ Player Routes   (11)                                    │
│  ├─ Transfer Routes (5) ⭐ With Transactions                │
│  ├─ Contract Routes (5)                                     │
│  └─ Agent Routes    (5)                                     │
└────────────────────────┬────────────────────────────────────┘
                         │ Prisma Client
                         ▼
┌─────────────────────────────────────────────────────────────┐
│        Middleware Layer (lib/)                              │
├─────────────────────────────────────────────────────────────┤
│  ├─ prisma.js       (Singleton Client)                      │
│  ├─ auth.js         (JWT Token Generation/Verification)     │
│  ├─ middleware.js   (requireAuth, Role Checking)            │
│  ├─ response.js     (Standard Response Format)              │
│  └─ validation.js   (Input Validation)                      │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL Queries
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MSSQL Database (TransferX)                      │
├─────────────────────────────────────────────────────────────┤
│  Tables:                                                    │
│  ├─ League          (league_id: PK)                         │
│  ├─ Club            (club_id: PK, league_id: FK)            │
│  ├─ Player          (player_id: PK, current_club_id: FK)    │
│  ├─ Agent           (agent_id: PK)                          │
│  ├─ Transfer        (transfer_id: PK) ⭐ Triggers History   │
│  ├─ TransferHistory (transfer_id, player_id: CPK)           │
│  ├─ Contract        (contract_id: PK)                       │
│  └─ PlayerAgent     (player_id, agent_id: CPK)              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### 1. Player Creation Flow

```
User Request: POST /api/players
    │
    ├─ Extract Auth Header
    │    │
    │    └─ requireAuth() validates JWT
    │         │
    │         ├─ Check token exists
    │         ├─ Verify token signature
    │         └─ Extract role
    │
    ├─ Check role === 'ADMIN'
    │    │
    │    └─ if role !== 'ADMIN' → 403 Forbidden
    │
    ├─ Validate JSON body
    │    │
    │    ├─ first_name (required)
    │    ├─ last_name (required)
    │    ├─ date_of_birth (required)
    │    └─ position, nationality, current_club_id, fee (optional)
    │
    ├─ Create Player via Prisma
    │    │
    │    └─ INSERT INTO Player VALUES(...)
    │
    └─ Return 201 Created with full player details
```

### 2. Transfer Creation Flow (WITH TRANSACTION)

```
User Request: POST /api/transfers
    │
    ├─ Authentication & Authorization check
    │
    ├─ Validate all required fields
    │    ├─ player_id
    │    ├─ from_club_id
    │    ├─ to_club_id
    │    ├─ transfer_date
    │    └─ transfer_type
    │
    ├─ Verify all entities exist
    │    ├─ Player.findUnique(player_id)
    │    ├─ Club.findUnique(from_club_id)
    │    └─ Club.findUnique(to_club_id)
    │
    └─ START TRANSACTION
         │
         ├─ Step 1: Create Transfer
         │    └─ INSERT INTO Transfer VALUES(...)
         │
         ├─ Step 2: Create TransferHistory
         │    └─ INSERT INTO TransferHistory VALUES(...)
         │
         ├─ Step 3: Update Player's current_club_id
         │    └─ UPDATE Player SET current_club_id = to_club_id
         │
         └─ COMMIT TRANSACTION
              │
              └─ Return 201 with full transfer details
                 (or rollback all changes on error)
```

### 3. Get Player with Full Details Flow

```
User Request: GET /api/players/1
    │
    ├─ Parse player ID from URL params
    │
    ├─ Query Player with includes:
    │    │
    │    ├─ current_club (include league info)
    │    │
    │    ├─ contracts (include club details)
    │    │
    │    ├─ transfer_history (include transfer with from/to clubs)
    │    │    │
    │    │    └─ ORDER BY transfer_date DESC
    │    │
    │    └─ agents (include agent names)
    │
    └─ Return 200 with nested object containing:
         ├─ Player details
         ├─ Current club (with league)
         ├─ All contracts (with clubs)
         ├─ All transfers (newest first)
         └─ All agents
```

---

## Code Examples

### Example 1: Simple GET Route (Leagues)

```javascript
// app/api/leagues/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, handleRouteError } from '@/lib/response';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const country = searchParams.get('country');

    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (country) where.country = { contains: country, mode: 'insensitive' };

    const leagues = await prisma.league.findMany({
      where,
      include: { clubs: true },
      orderBy: { league_id: 'asc' },
    });

    return successResponse(leagues);
  } catch (error) {
    return handleRouteError(error);
  }
}
```

### Example 2: Protected POST Route (Create Club)

```javascript
// app/api/clubs/route.js
import { requireAuth } from '@/lib/middleware';

export async function POST(request) {
  try {
    // 1. Verify authentication
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    // 2. Check admin role
    if (auth.role !== 'ADMIN') {
      return errorResponse('Only admin can create clubs', 403);
    }

    // 3. Parse request body
    const body = await request.json();
    const { league_id, name, country, founded_year } = body;

    // 4. Validate required fields
    if (!league_id || !name || !country) {
      return errorResponse('Missing required fields', 400);
    }

    // 5. Verify league exists
    const league = await prisma.league.findUnique({
      where: { league_id: parseInt(league_id) },
    });
    if (!league) return errorResponse('League not found', 404);

    // 6. Create club
    const club = await prisma.club.create({
      data: {
        league_id: parseInt(league_id),
        name,
        country,
        founded_year: founded_year ? parseInt(founded_year) : null,
      },
      include: { league: true },
    });

    // 7. Return created resource
    return successResponse(club, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
```

### Example 3: Transaction (Transfer Creation)

```javascript
// app/api/transfers/route.js
export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.role !== 'ADMIN') return errorResponse('Admin only', 403);

    const body = await request.json();
    const {
      player_id,
      from_club_id,
      to_club_id,
      transfer_fee,
      transfer_date,
      transfer_type,
    } = body;

    // Validate
    if (!player_id || !from_club_id || !to_club_id || !transfer_date || !transfer_type) {
      return errorResponse('Missing required fields', 400);
    }

    const playerId = parseInt(player_id);
    const fromClubId = parseInt(from_club_id);
    const toClubId = parseInt(to_club_id);

    // Verify entities
    const [player, fromClub, toClub] = await Promise.all([
      prisma.player.findUnique({ where: { player_id: playerId } }),
      prisma.club.findUnique({ where: { club_id: fromClubId } }),
      prisma.club.findUnique({ where: { club_id: toClubId } }),
    ]);

    if (!player) return errorResponse('Player not found', 404);
    if (!fromClub) return errorResponse('From club not found', 404);
    if (!toClub) return errorResponse('To club not found', 404);

    // ⭐ TRANSACTION: All operations succeed or all fail
    const transfer = await prisma.$transaction(async (tx) => {
      // 1. Create transfer
      const newTransfer = await tx.transfer.create({
        data: {
          player_id: playerId,
          from_club_id: fromClubId,
          to_club_id: toClubId,
          transfer_fee: transfer_fee ? parseFloat(transfer_fee) : null,
          transfer_date: new Date(transfer_date),
          transfer_type,
        },
        include: {
          player: true,
          from_club: true,
          to_club: true,
        },
      });

      // 2. Create transfer history
      await tx.transferHistory.create({
        data: {
          transfer_id: newTransfer.transfer_id,
          player_id: playerId,
          fee: transfer_fee ? parseFloat(transfer_fee) : null,
        },
      });

      // 3. Update player's club
      await tx.player.update({
        where: { player_id: playerId },
        data: { current_club_id: toClubId },
      });

      return newTransfer;
    });

    return successResponse(transfer, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
```

### Example 4: Complex Query with Relations

```javascript
// app/api/players/[id]/route.js
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const playerId = parseInt(id);

    const player = await prisma.player.findUnique({
      where: { player_id: playerId },
      include: {
        // Current club with league
        current_club: {
          include: { league: true },
        },
        // All contracts with club details
        contracts: {
          include: {
            club: {
              include: { league: true },
            },
          },
        },
        // Transfer history ordered by date DESC
        transfer_history: {
          include: {
            transfer: {
              include: {
                player: true,
                from_club: true,
                to_club: true,
              },
            },
          },
          orderBy: {
            transfer: {
              transfer_date: 'desc',
            },
          },
        },
        // Associated agents
        agents: {
          include: { agent: true },
        },
      },
    });

    if (!player) {
      return errorResponse('Player not found', 404);
    }

    return successResponse(player);
  } catch (error) {
    return handleRouteError(error);
  }
}
```

### Example 5: Advanced Filtering

```javascript
// app/api/players/route.js - GET with multiple filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const position = searchParams.get('position');
    const nationality = searchParams.get('nationality');
    const clubId = searchParams.get('clubId');

    const where = {};

    // Search by name (first or last)
    if (name) {
      where.OR = [
        { first_name: { contains: name, mode: 'insensitive' } },
        { last_name: { contains: name, mode: 'insensitive' } },
      ];
    }

    if (position) where.position = { contains: position, mode: 'insensitive' };
    if (nationality) where.nationality = { contains: nationality, mode: 'insensitive' };
    if (clubId) where.current_club_id = parseInt(clubId);

    const players = await prisma.player.findMany({
      where,
      include: {
        current_club: { include: { league: true } },
      },
      orderBy: { player_id: 'desc' },
    });

    return successResponse(players);
  } catch (error) {
    return handleRouteError(error);
  }
}
```

### Example 6: Many-to-Many Relationship (Assign Agent)

```javascript
// app/api/players/[id]/agents/route.js
export async function POST(request, { params }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.role !== 'ADMIN') return errorResponse('Admin only', 403);

    const { id } = await params;
    const playerId = parseInt(id);
    const { agent_id } = await request.json();

    if (!agent_id) {
      return errorResponse('Missing agent_id', 400);
    }

    const agentId = parseInt(agent_id);

    // Verify both exist
    const [player, agent] = await Promise.all([
      prisma.player.findUnique({ where: { player_id: playerId } }),
      prisma.agent.findUnique({ where: { agent_id: agentId } }),
    ]);

    if (!player) return errorResponse('Player not found', 404);
    if (!agent) return errorResponse('Agent not found', 404);

    // Create junction record
    const playerAgent = await prisma.playerAgent.create({
      data: {
        player_id: playerId,
        agent_id: agentId,
      },
      include: {
        player: true,
        agent: true,
      },
    });

    return successResponse(playerAgent, 201);
  } catch (error) {
    if (error.code === 'P2002') {
      return errorResponse('Agent is already assigned to this player', 409);
    }
    return handleRouteError(error);
  }
}
```

---

## Testing Workflow

### 1. Start Server
```bash
npm run dev
# Server running on http://localhost:3001
```

### 2. Get Admin Token
```bash
curl -X POST http://localhost:3001/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com"}'

# Response:
# {
#   "success": true,
#   "data": {
#     "token": "eyJhbGciOiJIUzI1NiIs...",
#     "role": "ADMIN",
#     "email": "admin@test.com"
#   }
# }
```

### 3. Save Token as Variable
```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

### 4. Test All Operations

```bash
# Create League
curl -X POST http://localhost:3001/api/leagues \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Premier League","country":"England"}'

# Create Club
curl -X POST http://localhost:3001/api/clubs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"league_id":1,"name":"Manchester United","country":"England","founded_year":1878}'

# Create Player
curl -X POST http://localhost:3001/api/players \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Cristiano","last_name":"Ronaldo","date_of_birth":"1985-02-05","position":"Forward","nationality":"Portugal","current_club_id":1}'

# Get Player Details
curl http://localhost:3001/api/players/1

# Filter Players
curl http://localhost:3001/api/players?nationality=Portugal

# Create Transfer
curl -X POST http://localhost:3001/api/transfers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "player_id":1,
    "from_club_id":2,
    "to_club_id":1,
    "transfer_fee":120.5,
    "transfer_date":"2023-03-15",
    "transfer_type":"PERMANENT"
  }'

# Get Club Transfers
curl http://localhost:3001/api/clubs/1/transfers

# Get Player Transfer History
curl http://localhost:3001/api/players/1/transfer-history
```

---

## Error Handling Examples

### Missing Authentication
```bash
curl -X POST http://localhost:3001/api/clubs

# Response 401:
{
  "success": false,
  "error": "No token provided"
}
```

### Invalid Role
```bash
curl -X POST http://localhost:3001/api/clubs \
  -H "Authorization: Bearer <non-admin-token>"

# Response 403:
{
  "success": false,
  "error": "Only admin can create clubs"
}
```

### Missing Required Fields
```bash
curl -X POST http://localhost:3001/api/clubs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"league_id":1}'

# Response 400:
{
  "success": false,
  "error": "Missing required fields: league_id, name, country"
}
```

### Resource Not Found
```bash
curl http://localhost:3001/api/players/999

# Response 404:
{
  "success": false,
  "error": "Player not found"
}
```

---

## Performance Considerations

✅ **Prisma Client Singleton** - Reuses connection pool
✅ **Include Relations** - Reduces N+1 queries
✅ **Indexed Fields** - league_id, current_club_id indexed
✅ **Transaction Support** - Atomic multi-step operations
✅ **Query Optimization** - Only fetches needed fields

---

## Security Best Practices

✅ **JWT Validation** - Every admin request verified
✅ **Role Checking** - Admin-only routes protected
✅ **Input Validation** - Type conversion and null checks
✅ **Error Messages** - Generic messages prevent info disclosure
✅ **HTTP Status Codes** - Proper codes for different scenarios

---

