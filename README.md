
# Product Catalog API

A RESTful API built with Node.js, Express, and MongoDB for managing products, categories, user authentication, and inventory. The API supports role-based access (user/admin), product variant management, search and filtering, and API documentation via Swagger.

---

## Features
- User registration & login with JWT authentication
- Role-based access control (admin and user)
- CRUD operations for Products & Categories
- Product variant management (size, color, stock, SKU)
- Product search & filtering by category, price, and collections
- Inventory update per product variant
- API documentation with Swagger UI
- Centralized error handling middleware

---

## Getting Started

### Prerequisites
- Node.js v16+
- MongoDB running locally or via cloud (e.g., MongoDB Atlas)
- npm package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/ykwizera/product-catalog-api.git

cd product-catalog-api
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root folder with the following variables:

```ini
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret
```

4. Start MongoDB if running locally

```bash
mongod
```

5. Start the server

```bash
npm run dev
# or
nodemon server.js
```

6. Open your browser to access the API docs:

```
http://localhost:3000/api-docs
```

---

## API Endpoints Overview

### Authentication

| Method | Endpoint               | Description             | Auth Required   |
|--------|------------------------|-------------------------|-----------------|
| POST   | /api/users/register    | Register a new user     | No              |
| POST   | /api/users/login       | Login & receive JWT     | No              |

### Products

| Method | Endpoint                   | Description                       | Auth Required       |
|--------|----------------------------|---------------------------------|---------------------|
| GET    | /api/products              | Get all products with filters    | No                  |
| GET    | /api/products/search       | Search products by term          | No                  |
| GET    | /api/products/low-stock    | Get products with low stock      | No                  |
| GET    | /api/products/:id          | Get product details by ID        | No                  |
| POST   | /api/products              | Create new product               | Yes (Admin only)    |
| PUT    | /api/products/:id          | Update product                  | Yes (Admin only)    |
| DELETE | /api/products/:id          | Delete product                  | Yes (Admin only)    |
| PATCH  | /api/products/:id/inventory| Update variant stock            | Yes (Admin only)    |

### Categories

| Method | Endpoint                   | Description                       | Auth Required       |
|--------|----------------------------|---------------------------------|---------------------|
| GET    | /api/categories            | Get all categories               | No                  |
| GET    | /api/categories/:id        | Get category by ID               | No                  |
| POST   | /api/categories            | Create new category              | Yes (Admin only)    |
| PUT    | /api/categories/:id        | Update category                 | Yes (Admin only)    |
| DELETE | /api/categories/:id        | Delete category                 | Yes (Admin only)    |

---

## Query Parameters for Products

- `category`: Filter products by category name
- `productCollection`: Filter by collection name
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `q`: Search term for name or description
- `threshold` (on `/low-stock`): Stock quantity threshold, default 10

---

## Authentication

Use JWT token in Authorization header for protected routes:

```http
Authorization: Bearer <token>
```

Only admin users can create/update/delete products and categories.

---

## Example Requests

### Register User

```http
POST /api/users/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

### Login User

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Create Product (Admin)

```http
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Premium T-Shirt",
  "price": 29.99,
  "category": "Clothing",
  "variants": [
    {
      "size": "M",
      "color": "Blue",
      "stock": 100,
      "sku": "TSH-M-BLU"
    }
  ]
}
```

---

## Error Handling

- 400 for validation and bad input errors
- 401 Unauthorized if token missing or invalid
- 403 Forbidden for unauthorized roles
- 404 Not Found for missing resources
- 500 Internal Server Error for unexpected failures

---

## Technologies Used

- Node.js & Express
- MongoDB with Mongoose ODM
- JSON Web Tokens for authentication
- bcryptjs for password hashing
- Swagger UI for API docs
- dotenv for environment variables
