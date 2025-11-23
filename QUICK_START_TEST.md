# Quick Start & Production Test Guide

## ✅ Current Status

- ✅ **Build**: Successful (`npm run build` completed)
- ✅ **TypeScript**: No compilation errors
- ✅ **Dependencies**: Installed
- ✅ **Configuration**: .env file exists
- ✅ **Build Output**: `dist/server.js` created

## 🚀 Test Your Application Now

### Option 1: Test Production Build (Recommended)

```bash
# Start the production server
npm start
```

**What to Look For:**
```
✅ MongoDB connected successfully
✅ Application initialized successfully  
✅ Server started successfully
```

**If you see errors:**
- MongoDB connection failed → Check your MONGODB_URI in .env
- Port in use → Change PORT in .env or kill process on port 3000

### Option 2: Test Development Mode

```bash
# Start with hot-reload
npm run dev
```

### Test Health Endpoint

**In a new terminal window:**

```bash
# PowerShell
Invoke-WebRequest -Uri http://localhost:3000/health

# Or using curl (if available)
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 123.45,
  "environment": "production"
}
```

### Test API Endpoints

**1. Get User's List:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/my-list/items" -Headers @{"X-User-Id"="user-1"}
```

**2. Add Item (after seeding):**
```powershell
$body = @{contentId="movie-1"; contentType="Movie"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/my-list/items" -Method POST -Headers @{"X-User-Id"="user-1"; "Content-Type"="application/json"} -Body $body
```

## 🔍 Common Issues & Fixes

### Issue 1: MongoDB Connection String Has Line Break

**Problem**: Connection string split across lines in .env

**Fix**: Make sure MONGODB_URI is on ONE line:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ott_platform?retryWrites=true&w=majority
```

### Issue 2: MongoDB Connection Failed

**Check**:
1. MongoDB Atlas cluster is running
2. IP address is whitelisted (0.0.0.0/0)
3. Username/password are correct
4. Connection string has no line breaks

### Issue 3: Port Already in Use

**Fix**:
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Or change PORT in .env
PORT=3001
```

## 📋 Production Readiness Summary

| Check | Status |
|-------|--------|
| Build succeeds | ✅ |
| TypeScript compiles | ✅ |
| dist/server.js exists | ✅ |
| .env configured | ✅ |
| Server starts | ⏳ Test with `npm start` |
| Health endpoint | ⏳ Test after server starts |
| API endpoints | ⏳ Test after server starts |

## 🎯 Next Steps

1. **Start the server**: `npm start`
2. **Test health**: `curl http://localhost:3000/health`
3. **Seed data** (optional): `npm run seed`
4. **Test API**: Use the examples above
5. **Run tests**: `npm test`

Your project is **ready to test**! 🚀

