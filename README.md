# El Eulma Store — Backend

## Setup (copy-paste these commands in order)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up the database
```bash
npx prisma db push
```

### 3. Seed the database with test data
```bash
npm run db:seed
```

### 4. Start the dev server
```bash
npm run dev
```

Server runs at: https://el-eulma-store.vercel.app/

---

## Test Accounts
| Role     | Email                        | Password   |
|----------|------------------------------|------------|
| Admin    | admin@eleulmastore.dz        | admin123   |
| Customer | customer@example.com         | user123    |
| Vendor   | vendor@electroplus.dz        | vendor123  |

---

## API Endpoints

> [!TIP]
> For a more detailed guide including request/response examples and full schemas, please refer to the [Detailed API Documentation](./API_DOCUMENTATION.md).


### Auth (Public)
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | /api/users/signup     | Register account   |
| POST   | /api/users/login      | Login              |

### Users (Requires token)
| Method | Endpoint                        | Description           |
|--------|---------------------------------|-----------------------|
| GET    | /api/users/me                   | Get my profile        |
| GET    | /api/users/:userId/addresses    | Get my addresses      |
| POST   | /api/users/addresses            | Add new address       |
| DELETE | /api/users/addresses/:id        | Delete address        |

### Products (Public)
| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| GET    | /api/products         | List products (filter/search/paginate)|
| GET    | /api/products/:id     | Get single product                   |

### Products (Vendor only)
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | /api/products         | Create product       |
| PUT    | /api/products/:id     | Update product       |
| DELETE | /api/products/:id     | Delete product       |

### Vendors (Public)
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/vendors          | List vendors         |
| GET    | /api/vendors/:id      | Get vendor + products|

### Vendors (Vendor only)
| Method | Endpoint                  | Description            |
|--------|---------------------------|------------------------|
| GET    | /api/vendors/me/profile   | My vendor profile      |
| GET    | /api/vendors/me/stats     | My dashboard stats     |
| PUT    | /api/vendors/me/profile   | Update my profile      |

### Orders (Requires token)
| Method | Endpoint                      | Description          |
|--------|-------------------------------|----------------------|
| POST   | /api/orders                   | Create order         |
| GET    | /api/orders/user/:userId      | My orders            |
| GET    | /api/orders/:id               | Single order         |
| PATCH  | /api/orders/:id/cancel        | Cancel order         |

### Admin (Admin only)
| Method | Endpoint                          | Description            |
|--------|-----------------------------------|------------------------|
| GET    | /api/admin/stats                  | Dashboard stats        |
| GET    | /api/admin/users                  | All users              |
| DELETE | /api/admin/users/:id              | Delete user            |
| GET    | /api/admin/orders                 | All orders             |
| PATCH  | /api/admin/orders/:id/status      | Update order status    |
| GET    | /api/admin/vendors                | All vendors            |
| PATCH  | /api/admin/vendors/:id/approve    | Approve vendor         |
| PATCH  | /api/admin/vendors/:id/reject     | Reject vendor          |

---

## How to use the token in requests

After login, you receive a `token`. Send it in every protected request:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Query Parameters for Products
- `GET /api/products?category=electronics` — filter by category
- `GET /api/products?search=samsung` — search by name
- `GET /api/products?page=1&limit=10` — pagination
- `GET /api/products?vendorId=xxx` — filter by vendor

## Reset Database
```bash
npm run db:reset
```
