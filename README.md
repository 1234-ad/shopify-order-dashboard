# 🛍️ Shopify Order Dashboard

A comprehensive Shopify app that allows merchants to view and manage orders from the last 60 days with detailed order information, line items, and images.

## ✨ Features

- **OAuth Authentication**: Secure Shopify app installation and authentication
- **Order Management**: View all orders from the last 60 days
- **Detailed Order View**: Access complete order details including items and images
- **Database Storage**: PostgreSQL database for efficient order storage and retrieval
- **GraphQL Integration**: Uses Shopify GraphQL Admin API for data fetching
- **RESTful API**: Clean REST endpoints for order operations

## 🏗️ Architecture

### Backend Stack
- **Node.js** + **Express.js**: Server framework
- **PostgreSQL**: Database for storing orders, fulfillment items, and images
- **Shopify API**: GraphQL Admin API integration
- **OAuth 2.0**: Secure authentication flow

### Database Schema

#### Tables:
1. **orders**: Stores order information
   - `id`, `shop`, `order_id`, `status`, `total_price`, `customer_name`, `customer_email`, `line_items`, `created_at`, `updated_at`

2. **fulfilment_items**: Stores fulfillment/return items
   - `id`, `return_id`, `line_item_id`, `qty`, `reason`, `image_url`, `order_id`, `created_at`

3. **images**: Stores item images
   - `id`, `image_url`, `return_item_id`, `created_at`

4. **sessions**: Stores Shopify OAuth sessions
   - `id`, `shop`, `state`, `is_online`, `scope`, `expires`, `access_token`, `created_at`, `updated_at`

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Shopify Partner Account
- Shopify Development Store

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/1234-ad/shopify-order-dashboard.git
cd shopify-order-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_SCOPES=read_orders,read_products
SHOPIFY_HOST=your-app-url.com

DATABASE_URL=postgresql://user:password@localhost:5432/shopify_orders

PORT=3000
NODE_ENV=development
```

4. **Set up the database**
```bash
# Create PostgreSQL database
createdb shopify_orders

# Run migrations
npm run db:migrate
```

5. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Authentication
- `GET /api/auth?shop=your-shop.myshopify.com` - Initiate OAuth flow
- `GET /api/auth/callback` - OAuth callback handler

### Orders
- `GET /api/orders?shop=your-shop.myshopify.com` - List all orders (last 60 days)
  - Query params: `limit` (default: 100), `offset` (default: 0)
  
- `GET /api/orders/:orderId?shop=your-shop.myshopify.com` - Get specific order details

- `POST /api/orders/sync?shop=your-shop.myshopify.com` - Sync orders from Shopify to database

### Health Check
- `GET /health` - Server health status

## 🔧 Usage

### 1. Create Shopify App

1. Go to [Shopify Partners Dashboard](https://partners.shopify.com/)
2. Create a new app
3. Set up App URL: `https://your-domain.com`
4. Set up Redirect URL: `https://your-domain.com/api/auth/callback`
5. Copy API Key and API Secret to `.env`

### 2. Install App

Visit: `https://your-domain.com/api/auth?shop=your-store.myshopify.com`

### 3. Sync Orders

After installation, sync orders:
```bash
curl -X POST "https://your-domain.com/api/orders/sync?shop=your-store.myshopify.com"
```

### 4. View Orders

```bash
curl "https://your-domain.com/api/orders?shop=your-store.myshopify.com"
```

## 📁 Project Structure

```
shopify-order-dashboard/
├── config/
│   ├── database.js          # PostgreSQL configuration
│   └── shopify.js            # Shopify API configuration
├── models/
│   ├── Order.js              # Order model
│   ├── FulfilmentItem.js     # Fulfillment item model
│   └── Image.js              # Image model
├── routes/
│   ├── auth.js               # Authentication routes
│   └── orders.js             # Order API routes
├── services/
│   └── shopifyService.js     # Shopify API service
├── scripts/
│   └── migrate.js            # Database migration script
├── utils/
│   └── sessionStorage.js     # Session storage utility
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env.example              # Environment variables template
└── README.md                 # Documentation
```

## 🔐 Security

- OAuth 2.0 authentication
- Session-based authorization
- Environment variable protection
- SQL injection prevention with parameterized queries
- CORS configuration

## 🛠️ Development

### Running Migrations
```bash
npm run db:migrate
```

### Development Mode
```bash
npm run dev
```

### Testing Endpoints
```bash
# Health check
curl http://localhost:3000/health

# List orders (after authentication)
curl "http://localhost:3000/api/orders?shop=your-store.myshopify.com"
```

## 📝 Notes

- Orders are automatically filtered to last 60 days
- GraphQL API is used for efficient data fetching
- Sessions are stored in PostgreSQL for scalability
- Line items include product images and details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your internship or commercial purposes.

## 🙋 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for Shopify merchants**