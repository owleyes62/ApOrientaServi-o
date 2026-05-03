/**
 * Factory de controller genérico para entidades vinculadas a uma pessoa.
 * Reutiliza a lógica CRUD evitando repetição de código.
 */

const pool = require('../config/database');

const criarController = (tabela, camposObrigatorios = [], camposPermitidos = []) => {

  // GET /pessoas/:pessoaId/<tabela>
  const listar = async (req, res) => {
    const { pessoaId } = req.params;
    try {
      const { rows } = await pool.query(
        `SELECT * FROM ${tabela} WHERE pessoa_id = $1 ORDER BY id ASC`, [pessoaId]
      );
      res.json({ sucesso: true, dados: rows, total: rows.length });
    } catch (err) {
      res.status(500).json({ sucesso: false, erro: err.message });
    }
  };

  // GET /pessoas/:pessoaId/<tabela>/:id
  const buscarPorId = async (req, res) => {
    const { pessoaId, id } = req.params;
    try {
      const { rows } = await pool.query(
        `SELECT * FROM ${tabela} WHERE id = $1 AND pessoa_id = $2`, [id, pessoaId]
      );
      if (!rows.length) {
        return res.status(404).json({ sucesso: false, erro: 'Registro não encontrado' });
      }
      res.json({ sucesso: true, dados: rows[0] });
    } catch (err) {
      res.status(500).json({ sucesso: false, erro: err.message });
    }
  };

  // POST /pessoas/:pessoaId/<tabela>
  const criar = async (req, res) => {
    const { pessoaId } = req.params;

    // Verifica campos obrigatórios
    for (const campo of camposObrigatorios) {
      if (!req.body[campo]) {
        return res.status(400).json({ sucesso: false, erro: `Campo '${campo}' é obrigatório` });
      }
    }

    const campos = camposPermitidos.filter(c => req.body[c] !== undefined);
    const valores = campos.map(c => req.body[c]);
    const indices = campos.map((_, i) => `$${i + 2}`);

    try {
      const query = `
        INSERT INTO ${tabela} (pessoa_id, ${campos.join(', ')})
        VALUES ($1, ${indices.join(', ')}) RETURNING *
      `;
      const { rows } = await pool.query(query, [pessoaId, ...valores]);
      res.status(201).json({ sucesso: true, dados: rows[0] });
    } catch (err) {
      res.status(500).json({ sucesso: false, erro: err.message });
    }
  };

  // PUT /pessoas/:pessoaId/<tabela>/:id
  const atualizar = async (req, res) => {
    const { pessoaId, id } = req.params;

    const campos = camposPermitidos.filter(c => req.body[c] !== undefined);
    if (!campos.length) {
      return res.status(400).json({ sucesso: false, erro: 'Nenhum campo válido enviado para atualização' });
    }

    const sets = campos.map((c, i) => `${c} = $${i + 1}`).join(', ');
    const valores = campos.map(c => req.body[c]);

    try {
      const { rows } = await pool.query(
        `UPDATE ${tabela} SET ${sets} WHERE id = $${campos.length + 1} AND pessoa_id = $${campos.length + 2} RETURNING *`,
        [...valores, id, pessoaId]
      );
      if (!rows.length) {
        return res.status(404).json({ sucesso: false, erro: 'Registro não encontrado' });
      }
      res.json({ sucesso: true, dados: rows[0] });
    } catch (err) {
      res.status(500).json({ sucesso: false, erro: err.message });
    }
  };

  // DELETE /pessoas/:pessoaId/<tabela>/:id
  const deletar = async (req, res) => {
    const { pessoaId, id } = req.params;
    try {
      const { rowCount } = await pool.query(
        `DELETE FROM ${tabela} WHERE id = $1 AND pessoa_id = $2`, [id, pessoaId]
      );
      if (!rowCount) {
        return res.status(404).json({ sucesso: false, erro: 'Registro não encontrado' });
      }
      res.json({ sucesso: true, mensagem: 'Registro removido com sucesso' });
    } catch (err) {
      res.status(500).json({ sucesso: false, erro: err.message });
    }
  };

  return { listar, buscarPorId, criar, atualizar, deletar };
};

module.exports = criarController;