const pool = require('../config/database');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        shop VARCHAR(255) NOT NULL,
        order_id VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50),
        total_price DECIMAL(10, 2),
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        line_items JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create fulfilment_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS fulfilment_items (
        id SERIAL PRIMARY KEY,
        return_id VARCHAR(255),
        line_item_id VARCHAR(255) NOT NULL,
        qty INTEGER NOT NULL,
        reason TEXT,
        image_url TEXT,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create images table
    await client.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        return_item_id INTEGER REFERENCES fulfilment_items(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create sessions table for Shopify OAuth
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        shop VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        is_online BOOLEAN DEFAULT false,
        scope VARCHAR(255),
        expires TIMESTAMP,
        access_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_orders_shop ON orders(shop);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sessions_shop ON sessions(shop);');

    await client.query('COMMIT');
    console.log('✅ Database tables created successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

createTables();