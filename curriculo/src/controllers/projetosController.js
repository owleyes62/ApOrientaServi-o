const pool = require('../config/database');

// GET /pessoas/:pessoaId/projetos
const listar = async (req, res) => {
  const { pessoaId } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        COALESCE(json_agg(h.*) FILTER (WHERE h.id IS NOT NULL), '[]') AS habilidades
      FROM projetos p
      LEFT JOIN projetos_habilidades ph ON ph.projeto_id = p.id
      LEFT JOIN habilidades h ON h.id = ph.habilidade_id
      WHERE p.pessoa_id = $1
      GROUP BY p.id
      ORDER BY p.data_inicio DESC
    `, [pessoaId]);
    res.json({ sucesso: true, dados: rows, total: rows.length });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
};

// GET /pessoas/:pessoaId/projetos/:id
const buscarPorId = async (req, res) => {
  const { pessoaId, id } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
        COALESCE(json_agg(h.*) FILTER (WHERE h.id IS NOT NULL), '[]') AS habilidades
      FROM projetos p
      LEFT JOIN projetos_habilidades ph ON ph.projeto_id = p.id
      LEFT JOIN habilidades h ON h.id = ph.habilidade_id
      WHERE p.id = $1 AND p.pessoa_id = $2
      GROUP BY p.id
    `, [id, pessoaId]);
    if (!rows.length) {
      return res.status(404).json({ sucesso: false, erro: 'Projeto não encontrado' });
    }
    res.json({ sucesso: true, dados: rows[0] });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
};

// POST /pessoas/:pessoaId/projetos
const criar = async (req, res) => {
  const { pessoaId } = req.params;
  const { nome, descricao, url, repositorio, data_inicio, data_fim, em_andamento, habilidades_ids } = req.body;

  if (!nome) {
    return res.status(400).json({ sucesso: false, erro: 'nome é obrigatório' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO projetos (pessoa_id, nome, descricao, url, repositorio, data_inicio, data_fim, em_andamento)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [pessoaId, nome, descricao, url, repositorio, data_inicio, data_fim, em_andamento ?? false]
    );
    const projeto = rows[0];

    // Vincula habilidades (N:N) se informadas
    if (habilidades_ids && habilidades_ids.length > 0) {
      const values = habilidades_ids.map((hid, i) => `($1, $${i + 2})`).join(', ');
      await client.query(
        `INSERT INTO projetos_habilidades (projeto_id, habilidade_id) VALUES ${values}`,
        [projeto.id, ...habilidades_ids]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ sucesso: true, dados: projeto });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ sucesso: false, erro: err.message });
  } finally {
    client.release();
  }
};

// PUT /pessoas/:pessoaId/projetos/:id
const atualizar = async (req, res) => {
  const { pessoaId, id } = req.params;
  const { nome, descricao, url, repositorio, data_inicio, data_fim, em_andamento, habilidades_ids } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `UPDATE projetos SET
        nome = COALESCE($1, nome),
        descricao = COALESCE($2, descricao),
        url = COALESCE($3, url),
        repositorio = COALESCE($4, repositorio),
        data_inicio = COALESCE($5, data_inicio),
        data_fim = COALESCE($6, data_fim),
        em_andamento = COALESCE($7, em_andamento)
       WHERE id = $8 AND pessoa_id = $9 RETURNING *`,
      [nome, descricao, url, repositorio, data_inicio, data_fim, em_andamento, id, pessoaId]
    );

    if (!rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ sucesso: false, erro: 'Projeto não encontrado' });
    }

    // Atualiza habilidades se enviadas
    if (habilidades_ids !== undefined) {
      await client.query('DELETE FROM projetos_habilidades WHERE projeto_id = $1', [id]);
      if (habilidades_ids.length > 0) {
        const values = habilidades_ids.map((hid, i) => `($1, $${i + 2})`).join(', ');
        await client.query(
          `INSERT INTO projetos_habilidades (projeto_id, habilidade_id) VALUES ${values}`,
          [id, ...habilidades_ids]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ sucesso: true, dados: rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ sucesso: false, erro: err.message });
  } finally {
    client.release();
  }
};

// DELETE /pessoas/:pessoaId/projetos/:id
const deletar = async (req, res) => {
  const { pessoaId, id } = req.params;
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM projetos WHERE id = $1 AND pessoa_id = $2', [id, pessoaId]
    );
    if (!rowCount) {
      return res.status(404).json({ sucesso: false, erro: 'Projeto não encontrado' });
    }
    res.json({ sucesso: true, mensagem: 'Projeto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, deletar };