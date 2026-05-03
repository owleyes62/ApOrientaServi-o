const { Pool } = require('pg');
require('dotenv').config();

// Monta a connection string com sslmode=verify-full para suprimir o aviso
// de depreciação das versões futuras do pg (v9) e pg-connection-string (v3)
const connectionString = process.env.DATABASE_URL?.includes('sslmode=')
  ? process.env.DATABASE_URL
  : `${process.env.DATABASE_URL}?sslmode=verify-full`;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

pool.on('connect', () => {
  console.log('✅ Conectado ao NeonDB (PostgreSQL)');
});

pool.on('error', (err) => {
  console.error('❌ Erro na conexão com o banco:', err.message);
  process.exit(-1);
});

module.exports = pool;