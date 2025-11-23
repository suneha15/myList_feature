# How to Run and Test Your Project

## Quick Start Guide

### Step 1: Verify Prerequisites ✅

```bash
# Check if dependencies are installed
npm list --depth=0

# If not installed:
npm install
```

### Step 2: Verify Configuration ✅

```bash
# Check .env file exists
# Should have MONGODB_URI configured
```

### Step 3: Build the Project ✅

```bash
npm run build
```

**Expected Output:**
```
> tsc
(No errors)
```

**Verify Build:**
```bash
# Check dist folder
ls dist/
# Should see: server.js, app.js, etc.
```

### Step 4: Test Production Build

#### Option A: Start Production Server

```bash
npm start
```

**Expected Output:**
```
✅ MongoDB connected successfully
✅ Using in-memory cache (Redis not available)
✅ Application initialized successfully
✅ Server started successfully { port: 3000, environment: 'production' }
```

#### Option B: Start Development Server (with hot-reload)

```bash
npm run dev
```

### Step 5: Test Health Endpoint

**In a new terminal:**

```bash
# Using curl
curl http://localhost:3000/health

# Using PowerShell
Invoke-WebRequest -Uri http://localhost:3000/health

# Expected Response:
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 123.45,
  "environment": "production"
}
```

### Step 6: Seed Database (Optional)

```bash
# Seed initial data
npm run seed

# This creates:
# - 5 users
# - 10 movies
# - 8 TV shows
# - 5 MyLists
```

### Step 7: Test API Endpoints

#### Test 1: Get User's List

```bash
curl http://localhost:3000/api/v1/my-list/items \
  -H "X-User-Id: user-1"
```

#### Test 2: Add Item to List

```bash
curl -X POST http://localhost:3000/api/v1/my-list/items \
  -H "X-User-Id: user-1" \
  -H "Content-Type: application/json" \
  -d '{"contentId": "movie-1", "contentType": "Movie"}'
```

#### Test 3: Remove Item from List

```bash
curl -X DELETE http://localhost:3000/api/v1/my-list/items/movie-1 \
  -H "X-User-Id: user-1"
```

### Step 8: Run Tests

```bash
# Integration tests
npm run test:integration

# All tests
npm test
```

## Troubleshooting

### Issue: MongoDB Connection Failed

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
1. Check MongoDB is running (local) or connection string is correct (Atlas)
2. Verify `.env` file has correct `MONGODB_URI`
3. Check IP is whitelisted in MongoDB Atlas

### Issue: Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process or change PORT in .env
```

### Issue: Build Errors

**Error**: TypeScript compilation errors

**Solution**:
```bash
# Clean and rebuild
rm -rf dist/
npm run build
```

## Production Readiness Checklist

- [x] ✅ Build succeeds (`npm run build`)
- [x] ✅ TypeScript compiles without errors
- [x] ✅ `dist/server.js` exists
- [ ] ⏳ Server starts successfully (`npm start`)
- [ ] ⏳ Health endpoint responds
- [ ] ⏳ API endpoints work
- [ ] ⏳ Tests pass (`npm test`)
- [ ] ⏳ MongoDB connection works

## Next: Deploy to Production

Once all tests pass:

1. **Push to GitHub** (without .env)
2. **Connect to hosting platform** (Render, Heroku, etc.)
3. **Set environment variables** in platform
4. **Deploy!**

Your project is ready! 🚀

