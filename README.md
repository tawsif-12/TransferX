TransferX - Football Transfer Database Management System
📌 Overview
TransferX is a comprehensive relational database management system designed to streamline and organize complex football operations, including player transfers, contract management, agent representation, and league participation. Built using Microsoft SQL Server, this project demonstrates robust database design principles through careful entity-relationship modeling, normalization, and implementation of advanced SQL features.

⚽ The Problem
Professional football ecosystems generate massive amounts of interconnected data involving players, clubs, agents, transfers, contracts, and leagues. Without a structured database system, managing this information leads to:

Data inconsistencies and redundancies

Inefficient tracking of player careers and club finances

Difficulty maintaining audit trails for transfers

Challenges in regulatory compliance and reporting

💡 Our Solution
TransferX provides a centralized, normalized relational database that ensures data integrity, supports real-time reporting, and delivers actionable insights into player movements and club operations.

🏗️ Database Architecture
Core Entities
PLAYER – Personal details, nationality, position, date of birth

CLUB – Club information, founding year, country

AGENT – Agent profiles and represented players

LEAGUE – League details by country

TRANSFER – Comprehensive transfer records (fee, date, type, clubs involved)

CONTRACT – Player-club contractual agreements (salary, duration)

PLAYER_AGENT – Many-to-many representation relationships

TRANSFER_HISTORY – Weak entity tracking transfer lifecycle events

Key Relationships
League has Clubs (1:n)

Players are contracted to Clubs (n:1)

Players are represented by Agents (m:n)

Players are involved in Transfers (ternary relationship with from_club and to_club)

Transfers generate Transfer History (1:n with weak entity)

🔧 Technical Implementation
DBMS: Microsoft SQL Server

IDE: SQL Server Management Studio (SSMS)

ERD Tool: draw.io (Chen Notation)

Version Control: Git & GitHub

Advanced SQL Features Implemented
✅ Constraints: Primary Key, Foreign Key, Unique, NOT NULL, CHECK

✅ Views: Player career history, club transfer summaries

✅ Stored Procedures: Add transfer, renew contract, generate reports

✅ Triggers: Validate transfer windows, update club budgets

✅ Indexes: Optimized on player_id, club_id, transfer_date

🎯 Project Goals
Design a normalized ER diagram following Chen notation standards

Enforce referential integrity through proper primary/foreign key relationships

Minimize data redundancy via normalization

Implement business rules using constraints and triggers

Provide efficient querying through indexes and views

Populate with realistic dummy data for testing

Demonstrate practical application of database concepts

📊 Sample Use Cases
Track complete player transfer history across clubs

Generate club financial reports on transfer spending

Monitor active contracts and upcoming expirations

Identify players represented by specific agents

Analyze transfer patterns by season, club, or league

Maintain audit trails for regulatory compliance

🚀 Future Enhancements
Web-based frontend interface for data visualization

Advanced analytics dashboard for transfer market insights

Integration with external football APIs for real-time data

Role-based access control for clubs, agents, and leagues

---

## 🛠️ Setup Instructions

### Prerequisites
- Windows OS
- Microsoft SQL Server or SQL Server Express installed
- Node.js 18+ installed
- Git (for version control)

### Quick Start

1. **Clone the Repository**
   ```powershell
   git clone <repository-url>
   cd TransferX
   ```

2. **Setup SQL Server Database**
   
   Follow the comprehensive guide:
   📖 **[TransferX/transferx-backend/MSSQL_SETUP_GUIDE.md](TransferX/transferx-backend/MSSQL_SETUP_GUIDE.md)**
   
   Quick steps:
   ```powershell
   # Create database
   sqlcmd -S localhost\SQLEXPRESS -E -Q "CREATE DATABASE transferx"
   
   # Navigate to backend
   cd TransferX\transferx-backend
   
   # Configure environment (copy .env.example to .env and update)
   Copy-Item .env.example .env
   
   # Install dependencies
   npm install
   
   # Create database tables
   npx prisma generate
   npx prisma db push
   
   # Load sample data
   node prisma/seed.js
   
   # Start backend server
   npm run dev
   ```

3. **Verify Setup**
   ```powershell
   # Run verification script
   cd TransferX\transferx-backend
   .\verify-mssql-setup.ps1
   ```

4. **Access the Application**
   - Backend API: http://localhost:3001/api
   - Prisma Studio: `npx prisma studio` (http://localhost:5555)

### Test Accounts (After Seeding)

| Role          | Email                  | Password  |
|---------------|------------------------|-----------|
| Admin         | admin@transferx.com    | admin123  |
| Player        | player@example.com     | player123 |
| Agent         | agent@example.com      | agent123  |
| Club Manager  | manager@example.com    | manager123|
| Fan           | fan@example.com        | fan123    |

---

## 📚 Documentation

### Database Documentation
- **[DATABASE_TABLES_REFERENCE.md](TransferX/transferx-backend/DATABASE_TABLES_REFERENCE.md)** - Detailed reference of all 9 database tables, relationships, and sample queries
- **[MSSQL_SETUP_GUIDE.md](TransferX/transferx-backend/MSSQL_SETUP_GUIDE.md)** - Complete SQL Server setup with troubleshooting

### Backend API Documentation  
- **[API_REFERENCE.md](TransferX/transferx-backend/API_REFERENCE.md)** - Complete API endpoint reference
- **[SETUP.md](TransferX/transferx-backend/SETUP.md)** - Backend setup and configuration
- **[README.md](TransferX/transferx-backend/README.md)** - Backend project overview

### Quick Reference
- **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** - Quick setup for all database options (MSSQL, MySQL, PostgreSQL)

### Entity-Relationship Model
The database consists of **9 interconnected tables**:

1. **User** - Authentication and user management
2. **League** - Football leagues/competitions
3. **Club** - Football clubs
4. **Player** - Player profiles and statistics
5. **Agent** - Football agents
6. **PlayerAgent** - Player-Agent relationships (many-to-many)
7. **Transfer** - Transfer transactions
8. **TransferHistory** - Historical transfer records
9. **Contract** - Player contracts with clubs

For detailed schema and relationships, see [DATABASE_TABLES_REFERENCE.md](TransferX/transferx-backend/DATABASE_TABLES_REFERENCE.md).

---

## 🔍 Verification & Testing

### Verify Database Tables

#### Using Prisma Studio (Visual Interface)
```powershell
cd TransferX\transferx-backend
npx prisma studio
```

#### Using SQLCMD
```powershell
# List all tables
sqlcmd -S localhost\SQLEXPRESS -d transferx -E -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'"

# View table relationships
sqlcmd -S localhost\SQLEXPRESS -d transferx -E -Q "SELECT OBJECT_NAME(parent_object_id) AS TableName, OBJECT_NAME(referenced_object_id) AS ReferencedTable FROM sys.foreign_keys"
```

#### Using SQL Server Management Studio (SSMS)
1. Connect to `localhost\SQLEXPRESS`
2. Expand Databases → transferx → Tables
3. View 9 tables with all relationships

### Test API Endpoints

```powershell
# Health check
curl http://localhost:3001/api

# Login test
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{\"email\":\"admin@transferx.com\",\"password\":\"admin123\"}'
```

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: "Cannot connect to SQL Server"
- **Solution**: Enable TCP/IP in SQL Server Configuration Manager and restart service
- See detailed steps in [MSSQL_SETUP_GUIDE.md](TransferX/transferx-backend/MSSQL_SETUP_GUIDE.md)

**Issue**: "Database 'transferx' does not exist"
- **Solution**: `sqlcmd -S localhost\SQLEXPRESS -E -Q "CREATE DATABASE transferx"`

**Issue**: "Prisma Client not found"
- **Solution**: `npx prisma generate`

For more troubleshooting, run the verification script:
```powershell
cd TransferX\transferx-backend
.\verify-mssql-setup.ps1
```

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Complex relational database design with ER modeling
- ✅ Normalization techniques (1NF, 2NF, 3NF)
- ✅ Referential integrity enforcement
- ✅ Efficient indexing strategies
- ✅ Stored procedures and triggers
- ✅ Many-to-many relationship management
- ✅ Weak entity modeling (Transfer History)
- ✅ Real-world business logic implementation

---

## 📄 License

This project is created for educational and demonstration purposes.

---

## 👥 Contributors

Database design and implementation for football transfer management system.

**Technical Stack**: SQL Server, Prisma ORM, Next.js, React
