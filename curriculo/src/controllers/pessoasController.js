const pool = require('../config/database');

// GET /pessoas
const listar = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM pessoas ORDER BY id ASC'
    );
    res.json({ sucesso: true, dados: rows, total: rows.length });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
};

// GET /pessoas/:id  (retorna currículo completo com todas as entidades)
const buscarPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: pessoa } = await pool.query(
      'SELECT * FROM pessoas WHERE id = $1', [id]
    );
    if (!pessoa.length) {
      return res.status(404).json({ sucesso: false, erro: 'Pessoa não encontrada' });
    }

    const [experiencias, formacoes, habilidades, projetos, certificados, idiomas] = await Promise.all([
      pool.query('SELECT * FROM experiencias WHERE pessoa_id = $1 ORDER BY data_inicio DESC', [id]),
      pool.query('SELECT * FROM formacoes WHERE pessoa_id = $1 ORDER BY data_inicio DESC', [id]),
      pool.query('SELECT * FROM habilidades WHERE pessoa_id = $1 ORDER BY categoria, nivel DESC', [id]),
      pool.query(`
        SELECT p.*, 
          COALESCE(json_agg(h.*) FILTER (WHERE h.id IS NOT NULL), '[]') AS habilidades
        FROM projetos p
        LEFT JOIN projetos_habilidades ph ON ph.projeto_id = p.id
        LEFT JOIN habilidades h ON h.id = ph.habilidade_id
        WHERE p.pessoa_id = $1
        GROUP BY p.id
        ORDER BY p.data_inicio DESC
      `, [id]),
      pool.query('SELECT * FROM certificados WHERE pessoa_id = $1 ORDER BY data_emissao DESC', [id]),
      pool.query('SELECT * FROM idiomas WHERE pessoa_id = $1 ORDER BY nivel DESC', [id]),
    ]);

    res.json({
      sucesso: true,
      dados: {
        ...pessoa[0],
        experiencias: experiencias.rows,
        formacoes: formacoes.rows,
        habilidades: habilidades.rows,
        projetos: projetos.rows,
        certificados: certificados.rows,
        idiomas: idiomas.rows,
      }
    });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
};

// POST /pessoas
const criar = async (req, res) => {
  const { nome, titulo, email, telefone, localizacao, linkedin, github, portfolio, resumo, foto_url } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ sucesso: false, erro: 'nome e email são obrigatórios' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO pessoas (nome, titulo, email, telefone, localizacao, linkedin, github, portfolio, resumo, foto_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [nome, titulo, email, telefone, localizacao, linkedin, github, portfolio, resumo, foto_url]
    );
    res.status(201).json({ sucesso: true, dados: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ sucesso: false, erro: 'Email já cadastrado' });
    }
    res.status(500).json({ sucesso: false, erro: err.message });
  }
};

// PUT /pessoas/:id
const atualizar = async (req, res) => {
  const { id } = req.params;
  const { nome, titulo, email, telefone, localizacao, linkedin, github, portfolio, resumo, foto_url } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE pessoas SET
        nome = COALESCE($1, nome),
        titulo = COALESCE($2, titulo),
        email = COALESCE($3, email),
        telefone = COALESCE($4, telefone),
        localizacao = COALESCE($5, localizacao),
        linkedin = COALESCE($6, linkedin),
        github = COALESCE($7, github),
        portfolio = COALESCE($8, portfolio),
        resumo = COALESCE($9, resumo),
        foto_url = COALESCE($10, foto_url),
        atualizado_em = NOW()
       WHERE id = $11 RETURNING *`,
      [nome, titulo, email, telefone, localizacao, linkedin, github, portfolio, resumo, foto_url, id]
    );
    if (!rows.length) {
      return res.status(404).json({ sucesso: false, erro: 'Pessoa não encontrada' });
    }
    res.json({ sucesso: true, dados: rows[0] });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
};

// DELETE /pessoas/:id
const deletar = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM pessoas WHERE id = $1', [id]);
    if (!rowCount) {
      return res.status(404).json({ sucesso: false, erro: 'Pessoa não encontrada' });
    }
    res.json({ sucesso: true, mensagem: 'Pessoa e todos os dados vinculados foram removidos' });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, deletar };