# Database & Cache Connection Guide

## How Connections Work

### Connection Flow

```
Server Start
    ↓
initializeApp() in app.ts
    ↓
├─→ validateEnv() - Validates environment variables
├─→ database.connect() - Connects to MongoDB
└─→ getCacheServiceInstance() - Initializes cache
```

## MongoDB Connection

### Connection String Source

**Priority Order:**
1. `.env` file → `MONGODB_URI` environment variable
2. Default fallback → `mongodb://localhost:27017/ott_platform`

### Current Configuration

```typescript
// From src/config/env.ts (line 19)
mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ott_platform'
```

### Will It Work Right Now?

**✅ YES, if:**
- MongoDB is running locally on port 27017
- No `.env` file exists (uses default)
- OR `.env` file has `MONGODB_URI=mongodb://localhost:27017/ott_platform`

**❌ NO, if:**
- MongoDB is not running
- MongoDB is on a different port
- Using MongoDB Atlas (needs connection string in `.env`)

### Connection Process

1. **Server starts** → `src/server.ts` calls `initializeApp()`
2. **App initialization** → `src/app.ts` calls `database.connect()`
3. **Database connection** → `src/config/database.ts`:
   - Reads URI from `env.mongodbUri`
   - Connects using Mongoose
   - Sets up event handlers (connected, error, disconnected)
   - Logs connection status

### Connection Options

```typescript
{
  maxPoolSize: 10,              // Connection pool size
  serverSelectionTimeoutMS: 5000, // 5 second timeout
  socketTimeoutMS: 45000,        // 45 second socket timeout
  bufferCommands: false,         // No command buffering
}
```

### Test Database

When `NODE_ENV=test`:
- Uses `MONGODB_TEST_URI` or default: `mongodb://localhost:27017/ott_platform_test`
- Separate database for tests (won't affect dev data)

## Redis Connection

### Connection String Source

**Priority Order:**
1. `.env` file → `REDIS_ENABLED=true` + Redis config
2. Fallback → In-memory cache (always works)

### Current Configuration

```typescript
// From src/config/env.ts (lines 23-28)
redis: {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  enabled: process.env.REDIS_ENABLED === 'true',  // Default: false
}
```

### Will It Work Right Now?

**✅ YES, ALWAYS:**
- **Default**: `REDIS_ENABLED=false` → Uses **in-memory cache** (no Redis needed)
- **If enabled**: `REDIS_ENABLED=true` → Tries Redis, falls back to in-memory if fails

### Connection Process

1. **Service initialization** → `getCacheServiceInstance()` called
2. **Factory checks** → `CacheServiceFactory.getInstance()`:
   - If `REDIS_ENABLED=true` → Tries to connect to Redis
   - If Redis fails or disabled → Falls back to in-memory cache
3. **Logs result** → "Using in-memory cache" or "Redis client ready"

### Fallback Strategy

```typescript
if (env.redis.enabled) {
  try {
    // Try Redis
    await redisCache.connect();
    if (connected) return redisCache;
  } catch (error) {
    // Fall through to in-memory
  }
}
// Always fallback to in-memory cache
return new InMemoryCacheService();
```

## Testing Your Connections

### Test MongoDB Connection

```bash
# 1. Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# 2. Or check connection in your app
npm run dev
# Look for: "MongoDB connected successfully" in logs
```

### Test Redis Connection (if enabled)

```bash
# 1. Check if Redis is running
redis-cli ping
# Should return: PONG

# 2. Enable Redis in .env
REDIS_ENABLED=true

# 3. Start app and check logs
npm run dev
# Look for: "Redis client ready" or "Using in-memory cache"
```

## Current Status Check

### Without .env File

**MongoDB:**
- ✅ Will try: `mongodb://localhost:27017/ott_platform`
- ⚠️ **Requires**: MongoDB running locally

**Redis:**
- ✅ Will use: In-memory cache (no Redis needed)
- ✅ **Works immediately** (no setup required)

### With .env File

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/ott_platform
REDIS_ENABLED=false
```

**MongoDB:**
- ✅ Uses connection string from `.env`
- ⚠️ **Requires**: MongoDB running

**Redis:**
- ✅ Uses in-memory cache (REDIS_ENABLED=false)
- ✅ **Works immediately**

## Quick Start Checklist

### To Run Right Now:

1. **MongoDB** (Required):
   ```bash
   # Option 1: Local MongoDB
   mongod
   
   # Option 2: MongoDB Atlas (add to .env)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ott_platform
   ```

2. **Redis** (Optional):
   ```bash
   # Only needed if you want Redis caching
   # Otherwise, in-memory cache works fine
   redis-server
   
   # Then in .env:
   REDIS_ENABLED=true
   ```

3. **Start App**:
   ```bash
   npm install
   npm run dev
   ```

## Connection Error Troubleshooting

### MongoDB Connection Failed

**Error**: `MongoServerError: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Start MongoDB: `mongod`
2. Check port: Default is 27017
3. Check connection string in `.env`
4. For MongoDB Atlas: Use full connection string

### Redis Connection Failed (if enabled)

**Error**: Redis connection errors

**Solutions:**
1. **Easiest**: Set `REDIS_ENABLED=false` in `.env` (uses in-memory)
2. Start Redis: `redis-server`
3. Check Redis host/port in `.env`

## Summary

| Component | Default | Works Without Setup? | Requires |
|-----------|---------|---------------------|----------|
| **MongoDB** | `mongodb://localhost:27017/ott_platform` | ❌ No | MongoDB running |
| **Redis** | In-memory cache | ✅ Yes | Nothing (fallback) |

**Bottom Line:**
- **MongoDB**: Must be running (local or Atlas)
- **Redis**: Optional, works without it (uses in-memory cache)

