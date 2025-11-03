const pool = require('../config/database');

class FulfilmentItemModel {
  async createFulfilmentItem(itemData) {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO fulfilment_items (return_id, line_item_id, qty, reason, image_url, order_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const result = await client.query(query, [
        itemData.returnId,
        itemData.lineItemId,
        itemData.qty,
        itemData.reason,
        itemData.imageUrl,
        itemData.orderId
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getFulfilmentItemsByOrderId(orderId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM fulfilment_items WHERE order_id = $1',
        [orderId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}

module.exports = new FulfilmentItemModel();