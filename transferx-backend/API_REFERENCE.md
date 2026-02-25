# API Endpoints Reference

## Base URL
```
http://localhost:3001/api
```

## Authentication Endpoints

### Sign Up
**POST** `/api/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "PLAYER"  // Optional: PLAYER, AGENT, CLUB_MANAGER
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "PLAYER",
      "createdAt": "2026-02-26T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
**POST** `/api/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "PLAYER",
      "playerProfile": { ... }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## User Profile Endpoints

### Get Current User Profile
**GET** `/api/user/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "player@example.com",
    "fullName": "John Striker",
    "role": "PLAYER",
    "playerProfile": {
      "id": 1,
      "position": "FORWARD",
      "nationality": "England",
      "rating": 7.8,
      "marketValue": 15.5,
      "goalsScored": 45,
      "assists": 12
    }
  }
}
```

### Update Profile
**PUT** `/api/user/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "John Striker Jr",
  "playerProfile": {
    "rating": 8.0,
    "marketValue": 20.0,
    "goalsScored": 50
  }
}
```

---

## Recommendations Endpoints

### Get Recommended Leagues
**GET** `/api/recommendations/leagues`

Get leagues recommended based on player tier.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "playerTier": 2,
    "tierDescription": "Established Player - Major Leagues",
    "playerStats": {
      "rating": 7.8,
      "marketValue": 15.5
    },
    "recommendedLeagues": [...]
  }
}
```

### Get Recommended Opportunities
**GET** `/api/recommendations/opportunities`

Get transfer opportunities matching player profile.

**Headers:**
```
Authorization: Bearer <token>
```

---

## Leagues Endpoints

### List Leagues
**GET** `/api/leagues`

**Query Parameters:**
- `country` (optional): Filter by country
- `tier` (optional): Filter by tier (1, 2, 3)
- `isActive` (optional): Filter active leagues

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Premier League",
      "country": "England",
      "tier": 1,
      "_count": {
        "clubs": 20
      }
    }
  ]
}
```

### Get League Details
**GET** `/api/leagues/[id]`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Premier League",
    "country": "England",
    "tier": 1,
    "clubs": [...]
  }
}
```

### Get Clubs in League
**GET** `/api/leagues/[id]/clubs`

---

## Clubs Endpoints

### List Clubs
**GET** `/api/clubs`

**Query Parameters:**
- `leagueId` (optional)
- `country` (optional)
- `search` (optional): Search by name

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Manchester United",
      "country": "England",
      "league": {
        "name": "Premier League"
      }
    }
  ]
}
```

### Get Club Details
**GET** `/api/clubs/[id]`

### Get Club Players
**GET** `/api/clubs/[id]/players`

### Get Club Ratings
**GET** `/api/clubs/[id]/ratings`

**Response:**
```json
{
  "success": true,
  "data": {
    "clubId": 1,
    "clubName": "Manchester United",
    "summary": {
      "averageRating": 4.2,
      "totalRatings": 15
    },
    "ratings": [...]
  }
}
```

---

## Players Endpoints

### List Players
**GET** `/api/players`

**Query Parameters:**
- `position` (optional): GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD
- `nationality` (optional)
- `minRating` (optional)
- `maxMarketValue` (optional)

---

## Transfer Opportunities Endpoints

### List Opportunities
**GET** `/api/opportunities`

**Query Parameters:**
- `position` (optional)
- `clubId` (optional)
- `leagueId` (optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "position": "MIDFIELDER",
      "minRating": 7.0,
      "maxBudget": 50.0,
      "description": "Looking for creative midfielder",
      "club": {
        "name": "Manchester United",
        "league": { "name": "Premier League" }
      }
    }
  ]
}
```

### Get Club Opportunities
**GET** `/api/opportunities/club/[id]`

---

## Documents Endpoints

### List User Documents
**GET** `/api/documents/list`

**Headers:**
```
Authorization: Bearer <token>
```

### Upload Document
**POST** `/api/documents/upload`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: File to upload
- `documentType`: CONTRACT, MEDICAL, PASSPORT, CERTIFICATE, etc.

---

## Applications (Transfer Requests) Endpoints

### List User Applications
**GET** `/api/applications`

**Headers:**
```
Authorization: Bearer <token>
```

### Submit Application
**POST** `/api/applications`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "clubId": 1,
  "proposedFee": 15.5,
  "proposedSalary": 3.5,
  "contractLength": 3,
  "transferWindow": "SUMMER",
  "coverLetter": "I am very interested..."
}
```

### Get Application Details
**GET** `/api/applications/[id]`

### Get Application Outcome
**GET** `/api/applications/[id]/outcome`

---

## Ratings Endpoints

### Rate a Club
**POST** `/api/ratings/club/[id]`

Must have completed transfer with club.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 4.5,
  "review": "Great experience with the club",
  "professionalism": 5,
  "facilities": 4,
  "communication": 4,
  "isAnonymous": false
}
```

---

## Admin Endpoints (ADMIN role required)

### Leagues Management

**GET** `/api/admin/leagues` - List all leagues
**POST** `/api/admin/leagues` - Create league
**PUT** `/api/admin/leagues/[id]` - Update league
**DELETE** `/api/admin/leagues/[id]` - Soft delete

### Clubs Management

**GET** `/api/admin/clubs` - List all clubs
**POST** `/api/admin/clubs` - Create club
**PUT** `/api/admin/clubs/[id]` - Update club
**DELETE** `/api/admin/clubs/[id]` - Soft delete

### Opportunities Management

**GET** `/api/admin/opportunities` - List all
**POST** `/api/admin/opportunities` - Create opportunity

### Documents Management

**GET** `/api/admin/documents` - List pending documents
**PUT** `/api/admin/documents/[id]/verify` - Verify/reject

**Request Body:**
```json
{
  "status": "VERIFIED",  // or "REJECTED"
  "note": "All documents verified"
}
```

### Applications Management

**GET** `/api/admin/applications` - List all applications
**PUT** `/api/admin/applications/[id]/status` - Update status

**Request Body:**
```json
{
  "status": "UNDER_REVIEW",
  "adminNotes": "Application under review"
}
```

**POST** `/api/admin/applications/[id]/outcome` - Create outcome

**Request Body:**
```json
{
  "approved": true,
  "finalFee": 18.0,
  "finalSalary": 4.0,
  "contractYears": 4,
  "notes": "Transfer approved"
}
```

### Ratings Moderation

**GET** `/api/admin/ratings` - List all ratings
**PUT** `/api/admin/ratings/[id]` - Approve/reject

**Request Body:**
```json
{
  "isApproved": true
}
```

---

## Error Responses

All endpoints may return error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error
