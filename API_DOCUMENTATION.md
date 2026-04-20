# El Eulma Store API Documentation

Welcome to the El Eulma Store API documentation. This API powers the El Eulma Store B2B platform, handling users, vendors, products, and orders.

## Base URL
The API base URL is: `http://localhost:5000/api` (or your production domain).

## Authentication
Most protected endpoints require a JSON Web Token (JWT).
- **Header**: `Authorization: Bearer <your_token>`
- **Obtaining a Token**: Tokens are provided upon successful [Signup](#signup) or [Login](#login).

---

## 1. Authentication & User Management

### Signup
Create a new user or vendor account.
- **Endpoint**: `POST /users/signup`
- **Auth Required**: No
- **Request Body**:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | string | Yes | Unique email address |
| `password` | string | Yes | Min 6 characters |
| `name` | string | Yes | Full name |
| `role` | string | Yes | `user` or `vendor` |
| `phone` | string | No | Contact number |
| `businessName` | string | Conditional | Required for vendors |
| `wilaya` | string | Conditional | Required for vendors |
| `registrationNumber` | string | Conditional | Required for vendors |

### Login
Authenticate and receive a token.
- **Endpoint**: `POST /users/login`
- **Auth Required**: No
- **Request Body**:
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | string | Yes | Account email |
| `password` | string | Yes | Account password |
| `role` | string | Yes | `user`, `vendor`, or `admin` |

### Password Recovery
- `POST /users/forgot-password`: Request a 6-digit reset key (sent via email).
- `POST /users/verify-reset-key`: Verify if the key is valid.
- `POST /users/reset-password`: Set a new password using the key.

### Profile Management
- `GET /users/me`: Get current authenticated user details. (Auth Required)
- `PUT /users/me`: Update profile (name, phone, avatar, password). (Auth Required)

### Addresses
- `GET /users/:userId/addresses`: List all addresses for a user. (Auth Required)
- `POST /users/addresses`: Add a new shipping address. (Auth Required)
- `DELETE /users/addresses/:id`: Remove an address. (Auth Required)

---

## 2. Products & Reviews

### Product Catalog
- `GET /products`: List all products.
- **Query Parameters**:
  - `category`: Filter by category name.
  - `vendorId`: Filter by vendor ID.
  - `search`: Search term for name/description.
  - `page`: Page number (default: 1).
  - `limit`: Items per page (default: 20).
- **Response Structure**:
  ```json
  {
    "data": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
  ```
- `GET /products/:id`: Get detailed information for a specific product.


### Product Management (Vendors Only)
- `POST /products`: Create a new product. (Auth: Vendor)
- `PUT /products/:id`: Update product details. (Auth: Vendor)
- `DELETE /products/:id`: Remove a product. (Auth: Vendor)

### Reviews
- `POST /products/:id/reviews`: Submit a review for a product (Rating: 1-5). (Auth Required)

---

## 3. Vendors

### Vendor Discovery
- `GET /vendors`: List all approved vendors.
- `GET /vendors/:id`: Get vendor public profile.

### Vendor Dashboard (Vendors Only)
- `GET /vendors/me/profile`: Get current vendor business profile. (Auth: Vendor)
- `PUT /vendors/me/profile`: Update business details. (Auth: Vendor)
- `GET /vendors/me/stats`: Get business performance statistics. (Auth: Vendor)

---

## 4. Orders

### Order Management
- `POST /orders`: Place a new order. (Auth Required)
- `GET /orders/user/:userId`: List orders for a specific user. (Auth Required)
- `GET /orders/:id`: Get order details, status, and items. (Auth Required)
- `PATCH /orders/:id/cancel`: Cancel a pending or confirmed order. (Auth Required)

---

## 5. Admin Panel
All endpoints in this section require the `admin` role.

### System Overview
- `GET /admin/stats`: Get global system statistics (Users, Orders, Revenue).

### User & Vendor Management
- `GET /admin/users`: List all registered users.
- `DELETE /admin/users/:id`: Delete a user account.
- `GET /admin/vendors`: List all vendor applications.
- `PATCH /admin/vendors/:id/approve`: Approve a vendor application.
- `PATCH /admin/vendors/:id/reject`: Reject a vendor application.

### Global Order Management
- `GET /admin/orders`: List all orders in the system.
- `PATCH /admin/orders/:id/status`: Update order status (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`).

---

## 6. Miscellaneous

### Health Check
- `GET /health`: Check if the server is healthy.

### Public Stats
- `GET /stats`: Get total products, approved vendors, and coverage info.

### Testimonials
- `GET /testimonials`: List customer testimonials.
- `POST /testimonials`: Submit a new testimonial. (Auth Required)

---

## Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```
