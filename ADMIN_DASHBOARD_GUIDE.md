# Admin Dashboard - Complete Guide

## 📋 Overview

The TransferX Admin Dashboard provides comprehensive management and control over all system data including players, clubs, transfers, contracts, and more. Only users with the **ADMIN** role can access this dashboard.

---

## 🔐 Admin Credentials

**Default Admin Login:**
```
Email: admin@transferx.com
Password: admin123
```

⚠️ **IMPORTANT**: Change these credentials in production! Use strong, unique passwords.

---

## 🎯 Key Features

### 1. **Player Management**
   - ✅ Add new players to the system
   - ✅ Edit existing player information
   - ✅ Update current club (when player transfers)
   - ✅ Update market value in real-time
   - ✅ View player career history
   - ✅ Delete players (if no related records)
   - ✅ Search and filter by name, position, nationality
   - ✅ Track transfers and contracts

### 2. **Club Management**
   - ✅ View all clubs in the system
   - ✅ Manage club information
   - ✅ View clubs by league
   - ✅ Track players in each club

### 3. **League Management**
   - ✅ View all leagues
   - ✅ Manage league details
   - ✅ View clubs in each league

### 4. **Transfer Management**
   - ✅ View all player transfers
   - ✅ Track transfer history
   - ✅ Monitor transfer values
   - ✅ Manage transfer records

### 5. **Contract Management**
   - ✅ Track player contracts
   - ✅ Monitor contract expiration
   - ✅ View contract details
   - ✅ Manage contract information

### 6. **Agent Management**
   - ✅ View all agents
   - ✅ Manage agent information
   - ✅ Track player-agent relationships

### 7. **System Analytics**
   - ✅ Real-time system overview
   - ✅ Total players, clubs, leagues statistics
   - ✅ Transfer market value tracking
   - ✅ Contract expiration alerts
   - ✅ System health monitoring

---

## 🎮 How to Use Admin Dashboard

### Step 1: Login as Admin

1. Go to `http://localhost:3000`
2. Click on login
3. Enter admin credentials:
   - Email: `admin@transferx.com`
   - Password: `admin123`
4. Click "Login"

### Step 2: Navigate to Admin Dashboard

After login, you'll be redirected to the admin dashboard with quick stats showing:
- 👥 Total Players
- 🏟️ Total Clubs
- 🏆 Total Leagues
- 🤝 Total Agents
- 🔄 Total Transfers
- 📋 Active Contracts
- 💰 Total Transfer Value
- ⚠️ Expiring Contracts

Click on any stat card to navigate to that management section.

---

## 📊 Player Management Features

### Adding a New Player

1. Navigate to **Player Management**
2. Click **"➕ Add Player"** button
3. Fill in the following details:

   **Personal Information:**
   - First Name (required)
   - Last Name (required)
   - Date of Birth (required)
   - Nationality

   **Professional Details:**
   - Position (Goalkeeper, Defender, Midfielder, Forward)
   - Current Club (optional - can be Free Agent)

   **Financial Information:**
   - Transfer Fee (€) - optional
   - Market Value (€) - optional

4. Click **"Add Player"** to create

### Editing Player Information

1. Go to **Player Management**
2. Find the player in the table
3. Click the **"✏️ Edit"** button
4. Update required fields:
   - ✅ Change club when player transfers
   - ✅ Update market value based on performance
   - ✅ Modify transfer fee
   - ✅ Update any personal information

5. Click **"Update Player"** to save

### Updating Market Value

**Common Scenarios:**
- Player improves performance → Increase market value
- Player injury or poor form → Decrease market value
- Player ages (gets older) → Gradually decrease value
- Young talent developing → Increase value

**Example:**
```
Player: Messi, Lionel
Current Market Value: €5,000,000
New Market Value: €6,500,000 (due to recent goals & assists)
```

### Changing Player Club

When a player transfers to a new club:

1. Edit the player
2. In **Professional Details** section
3. Change **Current Club** dropdown to new club
4. Update **Transfer Fee** if applicable
5. Click **"Update Player"**

The system automatically:
- ✅ Updates player's current club
- ✅ Records transfer history
- ✅ Maintains contract records

### Viewing Player Profile

1. From **Player Management** table
2. Click the **"👁️ View"** button
3. See detailed player profile including:
   - Career statistics
   - Transfer history
   - Active contracts
   - Agent relationships
   - Performance records

### Deleting Players

⚠️ **Note**: Players can only be deleted if they have:
- ❌ No active transfers
- ❌ No contracts
- ❌ No transfer history

To delete:
1. Click **"🗑️ Delete"** button
2. Confirm deletion
3. Player will be removed

---

## 🔍 Search and Filter Features

### Search by Player Name
- Type player name in search box
- Results update in real-time
- Search works on first and last names

### Filter by Position
- **Goalkeeper**
- **Defender**
- **Midfielder**
- **Forward**
- Select "All Positions" to clear filter

### Filter by Club
- Select club from dropdown
- Shows only players in that club
- Select "All Clubs" to clear filter

### Combine Filters
You can use multiple filters together:
- Example: Search "Messi" + Position "Forward" + Club "Barcelona"

---

## 📈 Market Value Guidelines

### Factors Affecting Market Value:

1. **Performance**
   - Goals and assists increase value
   - Poor performance decreases value

2. **Age**
   - Young players (18-28): Value peaks at 25-28
   - Mature players (28-32): Gradual decline
   - Veterans (32+): Significant decline

3. **Injury**
   - Long-term injuries reduce value
   - Recovery increases value back

4. **Competition Level**
   - Top league player: Higher value
   - Second tier league: Lower value

5. **International Performance**
   - International goals/caps: Higher value
   - National team selection: Increases value

### Market Value Update Strategy:

**Weekly/Bi-Weekly:**
- Review player performances
- Update based on recent matches
- Adjust for injuries

**Monthly:**
- Comprehensive review of all players
- Seasonal adjustments
- Competition level evaluations

**Quarterly:**
- Age-based adjustments
- Market trend analysis
- Contract year considerations

---

## 🔒 Security Considerations

### Only Admin Can:
- ✅ Access admin dashboard
- ✅ Add/edit/delete players
- ✅ Update market values
- ✅ Manage other admins
- ✅ View system analytics

### Admin Login Security:
1. **Strong Password**: Use minimum 12 characters, mix of uppercase, lowercase, numbers, symbols
2. **Unique Email**: Use company domain email
3. **Two-Factor Authentication**: Enable if available
4. **Session Management**: Log out after work session
5. **Regular Password Changes**: Change every 30-60 days

### Audit Trail:
All admin actions are logged for security and compliance:
- ✅ User, timestamp, action taken
- ✅ Original values and changed values
- ✅ IP address and session information

---

## 🚀 Admin API Endpoints

### Players
```
GET    /api/admin/players              - Get all players (with filters)
POST   /api/admin/players              - Create new player
GET    /api/admin/players/[id]         - Get player details
PUT    /api/admin/players/[id]         - Update player
DELETE /api/admin/players/[id]         - Delete player
```

### Clubs
```
GET    /api/admin/clubs                - Get all clubs
POST   /api/admin/clubs                - Create club
GET    /api/admin/clubs/[id]           - Get club details
PUT    /api/admin/clubs/[id]           - Update club
DELETE /api/admin/clubs/[id]           - Delete club
```

### Transfers
```
GET    /api/admin/transfers            - Get all transfers
POST   /api/admin/transfers            - Create transfer
PUT    /api/admin/transfers/[id]       - Update transfer
DELETE /api/admin/transfers/[id]       - Delete transfer
```

### Dashboard
```
GET    /api/admin/dashboard            - Get system analytics
```

---

## 📋 Common Tasks

### Task 1: Add New Player to System
1. Login as admin
2. Go to Player Management
3. Click "Add Player"
4. Fill all required fields
5. Click "Add Player"

### Task 2: Update Player's Club (Transfer)
1. Go to Player Management
2. Find and edit the player
3. Change "Current Club" dropdown
4. Click "Update Player"

### Task 3: Adjust Player Market Value
1. Edit the player
2. Go to "Financial Information"
3. Update "Market Value" field
4. Click "Update Player"

### Task 4: Search for Specific Player
1. Go to Player Management
2. Type player name in search box
3. Results filter automatically
4. Click player actions (view/edit/delete)

### Task 5: Filter Players by Position
1. Use "All Positions" dropdown
2. Select position (e.g., "Forward")
3. Table shows only players with that position
4. Can combine with search

### Task 6: View System Overview
1. Dashboard displays automatic stats
2. Click any stat card for details
3. Scroll for more information
4. Real-time data updates

---

## ⚠️ Important Notes

1. **Data Integrity**: 
   - Cannot delete players with active transfers/contracts
   - Use archive feature for historical records

2. **Market Value Accuracy**:
   - Keep market values realistic
   - Update regularly based on performance
   - Consider market trends

3. **Club Changes**:
   - Always update club when player transfers
   - System tracks transfer history automatically
   - Old contracts should be closed

4. **Password Security**:
   - 🔴 DO NOT share admin credentials
   - 🔴 DO NOT use simple passwords
   - ✅ DO rotate passwords regularly
   - ✅ DO log out after work

5. **Backup**:
   - System automatically backs up data
   - Contact IT for data recovery needs
   - Maintain audit logs for compliance

---

## 🆘 Troubleshooting

### Issue: Cannot access admin dashboard
**Solution**: 
- Verify you're logged in with admin account
- Check if account has ADMIN role
- Clear browser cache and try again

### Issue: Cannot update market value
**Solution**:
- Ensure you're editing an existing player
- Check that value is a valid number
- Try refreshing and try again

### Issue: Cannot delete player
**Solution**:
- Player must have no transfers/contracts
- Contact support to archive old records
- Try removing related records first

### Issue: Search/filter not working
**Solution**:
- Clear all filters and try again
- Refresh page
- Check browser console for errors
- Try different search terms

---

## 📞 Support

For issues or questions:
- 📧 Email: admin@transferx.com
- 💬 Chat: contact support team
- 📱 Phone: +1 (555) 123-4567
- 🐛 Report bugs to: bugs@transferx.com

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
