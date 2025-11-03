const pool = require('../config/database');

class OrderModel {
  async createOrder(orderData) {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO orders (shop, order_id, status, total_price, customer_name, customer_email, line_items, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        ON CONFLICT (order_id) 
        DO UPDATE SET 
          status = $3, total_price = $4, customer_name = $5, 
          customer_email = $6, line_items = $7, updated_at = NOW()
        RETURNING *
      `;
      const result = await client.query(query, [
        orderData.shop,
        orderData.orderId,
        orderData.status,
        orderData.totalPrice,
        orderData.customerName,
        orderData.customerEmail,
        JSON.stringify(orderData.lineItems),
        orderData.createdAt
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getOrders(shop, limit = 100, offset = 0) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT * FROM orders 
        WHERE shop = $1 AND created_at >= NOW() - INTERVAL '60 days'
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const result = await client.query(query, [shop, limit, offset]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getOrderById(orderId) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getOrderCount(shop) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT COUNT(*) FROM orders WHERE shop = $1 AND created_at >= NOW() - INTERVAL \'60 days\'',
        [shop]
      );
      return parseInt(result.rows[0].count);
    } finally {
      client.release();
    }
  }
}

module.exports = new OrderModel();