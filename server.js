const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api', authRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Shopify Order Dashboard API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Shopify Order Dashboard</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
          }
          h1 { color: #5c6ac4; }
          .info { background: #f4f6f8; padding: 20px; border-radius: 8px; }
          code { background: #e1e3e5; padding: 2px 6px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>🛍️ Shopify Order Dashboard</h1>
        <div class="info">
          <h2>Welcome!</h2>
          <p>This is a Shopify app for viewing orders from the last 60 days.</p>
          <h3>Available Endpoints:</h3>
          <ul>
            <li><code>GET /health</code> - Health check</li>
            <li><code>GET /api/auth?shop=your-shop.myshopify.com</code> - Start OAuth</li>
            <li><code>GET /api/orders?shop=your-shop.myshopify.com</code> - List orders</li>
            <li><code>GET /api/orders/:orderId?shop=your-shop.myshopify.com</code> - Get order details</li>
            <li><code>POST /api/orders/sync?shop=your-shop.myshopify.com</code> - Sync orders from Shopify</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Shopify Order Dashboard API ready`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;