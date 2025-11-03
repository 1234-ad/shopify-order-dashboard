const pool = require('../config/database');

class SessionStorage {
  async storeSession(session) {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO sessions (id, shop, state, is_online, scope, expires, access_token, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (id) 
        DO UPDATE SET 
          shop = $2, state = $3, is_online = $4, scope = $5, 
          expires = $6, access_token = $7, updated_at = NOW()
      `;
      await client.query(query, [
        session.id,
        session.shop,
        session.state,
        session.isOnline,
        session.scope,
        session.expires,
        session.accessToken
      ]);
      return true;
    } finally {
      client.release();
    }
  }

  async loadSession(id) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM sessions WHERE id = $1', [id]);
      if (result.rows.length === 0) return undefined;
      
      const row = result.rows[0];
      return {
        id: row.id,
        shop: row.shop,
        state: row.state,
        isOnline: row.is_online,
        scope: row.scope,
        expires: row.expires,
        accessToken: row.access_token
      };
    } finally {
      client.release();
    }
  }

  async deleteSession(id) {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM sessions WHERE id = $1', [id]);
      return true;
    } finally {
      client.release();
    }
  }

  async findSessionsByShop(shop) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM sessions WHERE shop = $1', [shop]);
      return result.rows.map(row => ({
        id: row.id,
        shop: row.shop,
        state: row.state,
        isOnline: row.is_online,
        scope: row.scope,
        expires: row.expires,
        accessToken: row.access_token
      }));
    } finally {
      client.release();
    }
  }
}

module.exports = new SessionStorage();