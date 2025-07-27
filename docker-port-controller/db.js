const { Pool } = require('pg');

const pool = new Pool({
  host: 'postgres_db',      // hoặc tên container nếu chạy trong Docker network
  port: 5432,
  user: 'postgres',
  password: '1234',
  database: 'product'
});

module.exports = pool;
