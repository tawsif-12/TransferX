# Admin Setup Guide

## 🚀 Setting Up Admin User

### Automatic Setup (Recommended)

Run the admin seed script to automatically create admin user:

```bash
# From backend directory
cd transferx-backend

# Run the admin seed script
node prisma/seed-admin.js
```

**Expected Output:**
```
🔐 Seeding Admin User...
✅ Admin user created/verified: admin@transferx.com
📧 Email: admin@transferx.com
🔑 Password: admin123

⚠️  IMPORTANT: In production, use strong hashed passwords!
```

---

## 🔑 Default Admin Credentials

```
Email: admin@transferx.com
Password: admin123
```

### Access Admin Dashboard

1. **Start Frontend**: `http://localhost:3000`
2. **Click Login**
3. **Enter Credentials**:
   - Email: `admin@transferx.com`
   - Password: `admin123`
4. **Click Login**
5. **You'll see Admin Dashboard** with system analytics

---

## 🔒 Production Setup

### ⚠️ DO NOT use default credentials in production!

#### Change Admin Password Steps:

1. **Login as Admin** (use default credentials)
2. **Go to Profile Settings**
3. **Click "Change Password"**
4. **Enter Current Password**: `admin123`
5. **Enter New Strong Password**: (min 12 chars, uppercase, numbers, symbols)
6. **Confirm New Password**
7. **Click "Update"**

#### Create New Admin User:

1. **As existing admin:**
   ```bash
   # Use admin API endpoint
   POST /api/admin/users/create
   
   {
     "email": "newadmin@company.com",
     "password": "StrongPassword123!",
     "fullName": "New Admin Name",
     "role": "ADMIN"
   }
   ```

2. **Database Direct** (SQL):
   ```sql
   INSERT INTO [User] (email, password, fullName, role, created_at, updated_at)
   VALUES (
     'admin@company.com',
     'hashed_password_here',
     'Admin Name',
     'ADMIN',
     GETDATE(),
     GETDATE()
   );
   ```

---

## ✅ Verification

### Check if Admin User Exists:

**Via SQL:**
```sql
SELECT id, email, role FROM [User] WHERE role = 'ADMIN';
```

**Via API:**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/admin/users
```

---

## 🛠️ Manual Admin User Creation

### If Seed Script Fails:

1. **Via Database (SQL Server)**:

```sql
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at)
VALUES (
  'admin@transferx.com',
  'admin123',
  'Admin User',
  'ADMIN',
  GETDATE(),
  GETDATE()
);
```

2. **Verify Creation**:
```sql
SELECT * FROM [User] WHERE email = 'admin@transferx.com';
```

---

## 📋 Admin Features Available

After login as admin, you can:

✅ **Player Management**
- Add/edit/delete players
- Update market values
- Change player clubs
- View player history

✅ **Club Management**
- Manage club information
- View club players
- Track club statistics

✅ **Transfer Management**
- Monitor transfers
- Track transfer history
- Manage transfer records

✅ **Contract Management**
- View contracts
- Monitor expirations
- Manage contract details

✅ **System Analytics**
- Real-time statistics
- System health monitoring
- Performance metrics

---

## 🔐 Security Best Practices

1. **Change Default Password** immediately
2. **Use Strong Passwords** (12+ chars, mixed case, numbers, symbols)
3. **Enable 2FA** when available
4. **Log Out** after work sessions
5. **Rotate Passwords** monthly
6. **Don't Share Credentials** with anyone
7. **Use VPN** for remote access
8. **Audit Logs** - Review admin actions regularly

---

## 🆘 Troubleshooting

### Issue: Seed Script Error

**Solution:**
```bash
# Ensure Prisma is set up
npm run prisma:generate

# Then run seed
node prisma/seed-admin.js
```

### Issue: Admin Cannot Login

**Solution:**
1. Verify admin user exists in database
2. Check password (case-sensitive)
3. Clear browser cache
4. Try incognito/private mode
5. Check database connection

### Issue: Admin Dashboard Not Showing

**Solution:**
1. Verify user role is "ADMIN"
2. Check authentication token
3. Restart backend server
4. Check browser console for errors

---

## 📞 Support

For setup issues, contact:
- 📧 admin@transferx.com
- 💬 Support team
- 🐛 Report bugs immediately

---

**Documentation Version**: 1.0  
**Last Updated**: April 2026
