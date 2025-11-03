## API Documentation

### Base URL
```
https://your-domain.com/api
```

### Authentication
All order endpoints require a valid Shopify session. Include the `shop` parameter in query string.

---

## Endpoints

### 1. Initiate OAuth
**GET** `/auth`

Start the Shopify OAuth flow.

**Query Parameters:**
- `shop` (required): Your Shopify store domain (e.g., `your-store.myshopify.com`)

**Example:**
```bash
GET /api/auth?shop=your-store.myshopify.com
```

**Response:**
Redirects to Shopify authorization page.

---

### 2. OAuth Callback
**GET** `/auth/callback`

Handles OAuth callback from Shopify (automatically called by Shopify).

---

### 3. List Orders
**GET** `/orders`

Retrieve all orders from the last 60 days.

**Query Parameters:**
- `shop` (required): Your Shopify store domain
- `limit` (optional): Number of orders to return (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Example:**
```bash
GET /api/orders?shop=your-store.myshopify.com&limit=50&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "shop": "your-store.myshopify.com",
        "order_id": "12345",
        "status": "fulfilled",
        "total_price": "99.99",
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "line_items": [
          {
            "id": "67890",
            "name": "Product Name",
            "quantity": 2,
            "price": "49.99",
            "imageUrl": "https://cdn.shopify.com/...",
            "productId": "111",
            "variantId": "222"
          }
        ],
        "created_at": "2025-10-15T10:30:00Z",
        "updated_at": "2025-10-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 50,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

---

### 4. Get Order Details
**GET** `/orders/:orderId`

Retrieve detailed information for a specific order.

**Path Parameters:**
- `orderId` (required): The Shopify order ID

**Query Parameters:**
- `shop` (required): Your Shopify store domain

**Example:**
```bash
GET /api/orders/12345?shop=your-store.myshopify.com
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "shop": "your-store.myshopify.com",
    "order_id": "12345",
    "status": "fulfilled",
    "total_price": "99.99",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "line_items": [
      {
        "id": "67890",
        "name": "Product Name",
        "quantity": 2,
        "price": "49.99",
        "imageUrl": "https://cdn.shopify.com/...",
        "productId": "111",
        "variantId": "222"
      }
    ],
    "created_at": "2025-10-15T10:30:00Z",
    "updated_at": "2025-10-15T10:30:00Z"
  }
}
```

---

### 5. Sync Orders
**POST** `/orders/sync`

Fetch orders from Shopify and sync them to the database.

**Query Parameters:**
- `shop` (required): Your Shopify store domain

**Example:**
```bash
POST /api/orders/sync?shop=your-store.myshopify.com
```

**Response:**
```json
{
  "success": true,
  "message": "Synced 150 orders",
  "data": {
    "count": 150
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Shop parameter is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized - Please authenticate"
}
```

### 404 Not Found
```json
{
  "error": "Order not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch orders"
}
```

---

## Rate Limiting

Follows Shopify's API rate limits:
- REST Admin API: 2 requests per second
- GraphQL Admin API: 50 points per second

---

## Data Models

### Order
```typescript
{
  id: number;
  shop: string;
  order_id: string;
  status: string;
  total_price: string;
  customer_name: string;
  customer_email: string;
  line_items: LineItem[];
  created_at: Date;
  updated_at: Date;
}
```

### LineItem
```typescript
{
  id: string;
  name: string;
  quantity: number;
  price: string;
  imageUrl: string;
  productId: string;
  variantId: string;
}
```