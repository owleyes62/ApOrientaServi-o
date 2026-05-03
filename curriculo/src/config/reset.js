require('dotenv').config();
const pool = require('./database');

const reset = async () => {
  const client = await pool.connect();
  try {
    console.log('🗑️  Limpando todos os dados do banco...\n');
    await client.query('BEGIN');

    // Ordem importa por causa das FK — deleta filhos antes dos pais
    await client.query('DELETE FROM projetos_habilidades');
    await client.query('DELETE FROM certificados');
    await client.query('DELETE FROM idiomas');
    await client.query('DELETE FROM projetos');
    await client.query('DELETE FROM habilidades');
    await client.query('DELETE FROM experiencias');
    await client.query('DELETE FROM formacoes');
    await client.query('DELETE FROM pessoas');

    // Reseta as sequences para IDs voltarem ao 1
    await client.query(`
      SELECT setval(pg_get_serial_sequence(t, 'id'), 1, false)
      FROM unnest(ARRAY['pessoas','experiencias','formacoes','habilidades','projetos','certificados','idiomas']) AS t
    `);

    await client.query('COMMIT');
    console.log('✅ Banco limpo! Agora rode: npm run seed');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro no reset:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

reset().catch(() => process.exit(1));