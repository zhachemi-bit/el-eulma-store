import http from 'http';

const data = JSON.stringify({
  email: 'owner_1@electroplus.dz',
  password: 'vendor123',
  role: 'vendor'
});

const loginReq = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('LOGIN:', body);
    const { token } = JSON.parse(body);
    
    // Now create a product
    const productData = JSON.stringify({
      name: 'Test Product ' + Date.now(),
      description: 'A test product',
      price: 15000,
      stock: 10,
      category: 'electronics',
      subcategory: 'electronics',
      originalPrice: "",
      images: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==']
    });

    const createReq = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(productData)
      }
    }, (res2) => {
      let body2 = '';
      res2.on('data', chunk => body2 += chunk);
      res2.on('end', () => {
        console.log('STATUS:', res2.statusCode);
        console.log('RESPONSE:', body2);
      });
    });
    
    createReq.write(productData);
    createReq.end();
  });
});

loginReq.write(data);
loginReq.end();
