# TransferX Frontend - Bangladesh Football Transfer Management System

A comprehensive React-based frontend for managing Bangladesh football transfers, players, clubs, and contracts.

## 🇧🇩 Project Overview

TransferX is specifically designed for the **Bangladesh football ecosystem**, focusing on:
- Bangladesh Premier League (BPL) clubs
- Bangladeshi players and their careers
- Domestic transfers and contracts
- Local agents and representation
- Bangladesh Football Federation compliance

## ⚽ Featured Clubs

- **Bashundhara Kings** - BPL Champions
- **Dhaka Abahani Limited** - Historic club founded 1972
- **Mohammedan SC Dhaka** - One of Bangladesh's oldest clubs
- **Sheikh Russel KC** - Named after Sheikh Russel
- **Chittagong Abahani** - Representing Chittagong region

## 🎯 Features

- **Player Management**: Track Bangladeshi players across domestic clubs
- **Transfer Tracking**: Monitor transfers within Bangladesh Premier League
- **Contract Management**: Manage player contracts with BDT salary information
- **Agent Portal**: Local agent representation system
- **League Analytics**: Insights into BPL and domestic competitions
- **Admin Dashboard**: Complete CRUD operations for all entities

## 🛠️ Tech Stack

- **Framework**: React 18 (Vite)
- **Routing**: React Router v6
- **HTTP Client**: Axios with JWT authentication
- **State Management**: React Context API
- **Styling**: Plain CSS with CSS custom properties
- **Fonts**: Outfit (headings) + DM Sans (body)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will run on `http://localhost:3000`

### Demo Credentials

**Regular User:**
- Email: `user@transferx.com`
- Password: `user123`

**Admin:**
- Email: `admin@transferx.com`
- Password: `admin123`

## 📁 Project Structure

```
src/
├── api/              # Axios client configuration
├── components/       # Reusable React components
├── context/          # Auth context for state management
├── mock/             # Bangladesh football mock data
├── pages/            # Application pages (user & admin)
│   ├── auth/         # Login & signup pages
│   ├── user/         # User-facing pages
│   └── admin/        # Admin CRUD pages
└── utils/            # Helper functions & validators
```

## 🇧🇩 Mock Data

The application includes realistic Bangladesh football data:
- **850+ Players** from Bangladeshi clubs
- **45+ Clubs** including all BPL teams
- **5 Leagues** (BPL, Championship League, Federation Cup, etc.)
- **85+ Agents** operating in Bangladesh
- **620+ Active Contracts** with BDT salary information

## 🔐 Authentication

- JWT-based authentication
- Role-based access control (User/Admin)
- Protected routes with automatic redirects
- LocalStorage session persistence

## 🎨 Design System

Custom CSS variables for consistent styling:
- Dark green theme reflecting Bangladesh football
- Responsive design (mobile-first approach)
- Smooth transitions and animations
- Accessible color contrasts

## 📊 Key Pages

### User Portal
- **Dashboard**: Overview of Bangladesh football stats
- **Players**: Browse Bangladeshi players
- **Clubs**: Explore BPL and other domestic clubs
- **Transfers**: Track domestic transfer movements
- **Agents**: View local agent profiles

### Admin Portal
- **Manage Players**: CRUD operations for players
- **Manage Clubs**: Bangladesh club management
- **Manage Leagues**: Domestic league administration
- **Manage Transfers**: Transfer record management
- **Transfer History**: Audit trail for all transactions

## 🔄 Backend Integration Ready

All API calls are prepared for backend integration:
- Axios client with interceptors configured
- Mock data easily replaceable with real API calls
- Commented API endpoints throughout codebase

## 📝 License

This project is for educational and portfolio purposes.

---

**TransferX** - Empowering Bangladesh Football Management 🇧🇩⚽
