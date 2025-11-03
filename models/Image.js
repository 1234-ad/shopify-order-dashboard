const pool = require('../config/database');

class ImageModel {
  async createImage(imageData) {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO images (image_url, return_item_id)
        VALUES ($1, $2)
        RETURNING *
      `;
      const result = await client.query(query, [
        imageData.imageUrl,
        imageData.returnItemId
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getImagesByReturnItemId(returnItemId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM images WHERE return_item_id = $1',
        [returnItemId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}

module.exports = new ImageModel();