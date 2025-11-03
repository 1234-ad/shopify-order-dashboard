const express = require('express');
const router = express.Router();
const OrderModel = require('../models/Order');
const ShopifyService = require('../services/shopifyService');
const sessionStorage = require('../utils/sessionStorage');

// Middleware to verify shop session
async function verifyShopSession(req, res, next) {
  const { shop } = req.query;
  
  if (!shop) {
    return res.status(400).json({ error: 'Shop parameter is required' });
  }

  try {
    const sessions = await sessionStorage.findSessionsByShop(shop);
    if (!sessions || sessions.length === 0) {
      return res.status(401).json({ error: 'Unauthorized - Please authenticate' });
    }
    
    req.session = sessions[0];
    req.shopifyService = new ShopifyService(shop, sessions[0].accessToken);
    next();
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ error: 'Session verification failed' });
  }
}

// GET /api/orders - List all orders from database
router.get('/', verifyShopSession, async (req, res) => {
  try {
    const { shop } = req.query;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const orders = await OrderModel.getOrders(shop, limit, offset);
    const totalCount = await OrderModel.getOrderCount(shop);

    res.json({
      success: true,
      data: {
        orders: orders.map(order => ({
          ...order,
          line_items: typeof order.line_items === 'string' 
            ? JSON.parse(order.line_items) 
            : order.line_items
        })),
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:orderId - Get specific order details
router.get('/:orderId', verifyShopSession, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      data: {
        ...order,
        line_items: typeof order.line_items === 'string' 
          ? JSON.parse(order.line_items) 
          : order.line_items
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST /api/orders/sync - Sync orders from Shopify to database
router.post('/sync', verifyShopSession, async (req, res) => {
  try {
    const orders = await req.shopifyService.fetchOrders();
    
    const savedOrders = [];
    for (const order of orders) {
      const saved = await OrderModel.createOrder(order);
      savedOrders.push(saved);
    }

    res.json({
      success: true,
      message: `Synced ${savedOrders.length} orders`,
      data: { count: savedOrders.length }
    });
  } catch (error) {
    console.error('Error syncing orders:', error);
    res.status(500).json({ error: 'Failed to sync orders' });
  }
});

module.exports = router;