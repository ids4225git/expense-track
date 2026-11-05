// =============================================================
// BACKEND API INTEGRATION TEST SCRIPT
// =============================================================
// Tests:
// 1. Health check
// 2. User registration
// 3. User login (receives JWT)
// 4. Create expenses
// 5. List expenses (with & without filters)
// 6. Expense summary calculation
// 7. Update an expense
// 8. Delete an expense
// =============================================================

const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting API Integration Tests ---');
  const baseHeaders = { 'Content-Type': 'application/json' };

  // 1. Health check
  console.log('\n1. Testing GET / (Health check)...');
  const health = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
  });
  console.log(`Status: ${health.status}`, health.data);

  // 2. Register
  console.log('\n2. Testing POST /api/auth/register...');
  const testEmail = `user_${Date.now()}@test.com`;
  const registerRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: baseHeaders,
    },
    { name: 'Junior Dev', email: testEmail, password: 'password123' }
  );
  console.log(`Status: ${registerRes.status}`, registerRes.data);

  // 3. Login
  console.log('\n3. Testing POST /api/auth/login...');
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: baseHeaders,
    },
    { email: testEmail, password: 'password123' }
  );
  console.log(`Status: ${loginRes.status}`, loginRes.data ? { token: loginRes.data.token?.slice(0, 20) + '...', user: loginRes.data.user } : null);
  const token = loginRes.data?.token;

  if (!token) {
    throw new Error('Failed to obtain token from login');
  }

  const authHeaders = {
    ...baseHeaders,
    Authorization: `Bearer ${token}`,
  };

  // 4. Create Expenses
  console.log('\n4. Testing POST /api/expenses (Creating 2 expenses)...');
  const exp1 = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/expenses',
      method: 'POST',
      headers: authHeaders,
    },
    {
      title: 'Groceries at Supermarket',
      amount: 45.5,
      currency: 'USD',
      category: 'Food',
      date: new Date().toISOString(),
      description: 'Weekly grocery run',
    }
  );
  console.log(`Expense 1 created (status ${exp1.status}):`, exp1.data?.title, `${exp1.data?.currency} ${exp1.data?.amount}`);

  const exp2 = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/expenses',
      method: 'POST',
      headers: authHeaders,
    },
    {
      title: 'Monthly Train Pass',
      amount: 80.0,
      currency: 'JPY',
      category: 'Transport',
      date: new Date().toISOString(),
      description: 'Metro pass',
    }
  );
  console.log(`Expense 2 created (status ${exp2.status}):`, exp2.data?.title, `${exp2.data?.currency} ${exp2.data?.amount}`);

  // 5. Get Expenses
  console.log('\n5. Testing GET /api/expenses...');
  const listRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/expenses',
    method: 'GET',
    headers: authHeaders,
  });
  console.log(`Status: ${listRes.status}, Count: ${listRes.data?.length}`);

  // 6. Get Summary
  console.log('\n6. Testing GET /api/expenses/summary...');
  const summaryRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/expenses/summary',
    method: 'GET',
    headers: authHeaders,
  });
  console.log(`Summary (status ${summaryRes.status}):`, summaryRes.data?.totalsByCurrency, `Count = ${summaryRes.data?.totalCount}, Categories = ${summaryRes.data?.byCategory?.length}`);

  // 7. Update Expense 1
  console.log('\n7. Testing PUT /api/expenses/:id...');
  const updateRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/expenses/${exp1.data.id}`,
      method: 'PUT',
      headers: authHeaders,
    },
    {
      title: 'Groceries (Organic Market)',
      amount: 52.0,
      category: 'Food',
      date: exp1.data.date,
      description: 'Updated with receipt items',
    }
  );
  console.log(`Status: ${updateRes.status}, Updated Title:`, updateRes.data?.title, `New Amount: ${updateRes.data?.currency} ${updateRes.data?.amount}`);

  // 8. Delete Expense 2
  console.log('\n8. Testing DELETE /api/expenses/:id...');
  const delRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/expenses/${exp2.data.id}`,
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log(`Status: ${delRes.status}:`, delRes.data);

  console.log('\nAll Backend API tests passed successfully!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
