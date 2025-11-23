/**
 * Quick Production Readiness Test
 * Tests if the built application can start
 */

const { spawn } = require('child_process');
const http = require('http');

console.log('🧪 Testing Production Build...\n');

// Test 1: Check if dist/server.js exists
const fs = require('fs');
if (!fs.existsSync('./dist/server.js')) {
  console.error('❌ dist/server.js not found. Run: npm run build');
  process.exit(1);
}
console.log('✅ dist/server.js exists');

// Test 2: Try to start the server
console.log('\n🚀 Starting server...');
const server = spawn('node', ['dist/server.js'], {
  env: { ...process.env, NODE_ENV: 'production' },
  stdio: 'pipe'
});

let serverOutput = '';
let serverStarted = false;

server.stdout.on('data', (data) => {
  serverOutput += data.toString();
  const output = data.toString();
  console.log(output);
  
  if (output.includes('Server started successfully') || output.includes('Application initialized successfully')) {
    serverStarted = true;
    console.log('\n✅ Server started successfully!');
    
    // Test health endpoint
    setTimeout(() => {
      testHealthEndpoint();
    }, 2000);
  }
});

server.stderr.on('data', (data) => {
  console.error('Server Error:', data.toString());
});

server.on('close', (code) => {
  if (!serverStarted) {
    console.error('\n❌ Server failed to start');
    console.error('Output:', serverOutput);
    process.exit(1);
  }
});

function testHealthEndpoint() {
  console.log('\n🏥 Testing health endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: process.env.PORT || 3000,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Health endpoint working!');
        console.log('Response:', data);
        console.log('\n✅ Production readiness test PASSED!');
        server.kill();
        process.exit(0);
      } else {
        console.error('❌ Health endpoint returned:', res.statusCode);
        server.kill();
        process.exit(1);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Health endpoint test failed:', error.message);
    server.kill();
    process.exit(1);
  });

  req.end();
}

// Timeout after 30 seconds
setTimeout(() => {
  if (!serverStarted) {
    console.error('\n❌ Server startup timeout');
    server.kill();
    process.exit(1);
  }
}, 30000);

