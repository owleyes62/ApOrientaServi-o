require('dotenv').config();
const pool = require('./database');

const createTables = async () => {
  const client = await pool.connect();

  try {
    console.log('🚀 Iniciando migração do banco de dados...\n');

    await client.query('BEGIN');

    // TABELA: pessoas (entidade principal)
    await client.query(`
      CREATE TABLE IF NOT EXISTS pessoas (
        id          SERIAL PRIMARY KEY,
        nome        VARCHAR(100) NOT NULL,
        titulo      VARCHAR(150),
        email       VARCHAR(150) UNIQUE NOT NULL,
        telefone    VARCHAR(20),
        localizacao VARCHAR(100),
        linkedin    VARCHAR(200),
        github      VARCHAR(200),
        portfolio   VARCHAR(200),
        resumo      TEXT,
        foto_url    VARCHAR(300),
        criado_em   TIMESTAMP DEFAULT NOW(),
        atualizado_em TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tabela pessoas criada');

    // TABELA: experiencias (N:1 com pessoas)
    await client.query(`
      CREATE TABLE IF NOT EXISTS experiencias (
        id          SERIAL PRIMARY KEY,
        pessoa_id   INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
        empresa     VARCHAR(150) NOT NULL,
        cargo       VARCHAR(150) NOT NULL,
        descricao   TEXT,
        data_inicio DATE NOT NULL,
        data_fim    DATE,
        atual       BOOLEAN DEFAULT FALSE,
        modalidade  VARCHAR(20) CHECK (modalidade IN ('presencial', 'remoto', 'hibrido')) DEFAULT 'presencial',
        criado_em   TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tabela experiencias criada');

    // TABELA: formacoes (N:1 com pessoas)
    await client.query(`
      CREATE TABLE IF NOT EXISTS formacoes (
        id           SERIAL PRIMARY KEY,
        pessoa_id    INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
        instituicao  VARCHAR(150) NOT NULL,
        curso        VARCHAR(150) NOT NULL,
        grau         VARCHAR(50) CHECK (grau IN ('tecnico', 'graduacao', 'pos_graduacao', 'mestrado', 'doutorado', 'bootcamp', 'curso')) NOT NULL,
        descricao    TEXT,
        data_inicio  DATE NOT NULL,
        data_fim     DATE,
        em_andamento BOOLEAN DEFAULT FALSE,
        criado_em    TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tabela formacoes criada');

    // TABELA: habilidades (N:1 com pessoas)
    await client.query(`
      CREATE TABLE IF NOT EXISTS habilidades (
        id        SERIAL PRIMARY KEY,
        pessoa_id INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
        nome      VARCHAR(100) NOT NULL,
        nivel     VARCHAR(20) CHECK (nivel IN ('basico', 'intermediario', 'avancado', 'especialista')) DEFAULT 'intermediario',
        categoria VARCHAR(50) CHECK (categoria IN ('linguagem', 'framework', 'banco_dados', 'ferramenta', 'soft_skill', 'outro')) DEFAULT 'outro',
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tabela habilidades criada');

    // TABELA: projetos (N:1 com pessoas)
    await client.query(`
      CREATE TABLE IF NOT EXISTS projetos (
        id          SERIAL PRIMARY KEY,
        pessoa_id   INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
        nome        VARCHAR(150) NOT NULL,
        descricao   TEXT,
        url         VARCHAR(300),
        repositorio VARCHAR(300),
        data_inicio DATE,
        data_fim    DATE,
        em_andamento BOOLEAN DEFAULT FALSE,
        criado_em   TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tabela projetos criada');

    // TABELA: projetos_habilidades (N:N entre projetos e habilidades)
    await client.query(`
      CREATE TABLE IF NOT EXISTS projetos_habilidades (
        projeto_id   INTEGER NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
        habilidade_id INTEGER NOT NULL REFERENCES habilidades(id) ON DELETE CASCADE,
        PRIMARY KEY (projeto_id, habilidade_id)
      );
    `);
    console.log('✅ Tabela projetos_habilidades (N:N) criada');

    // TABELA: certificados (N:1 com pessoas)
    await client.query(`
      CREATE TABLE IF NOT EXISTS certificados (
        id           SERIAL PRIMARY KEY,
        pessoa_id    INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
        nome         VARCHAR(200) NOT NULL,
        emissor      VARCHAR(150) NOT NULL,
        data_emissao DATE,
        data_expiracao DATE,
        url          VARCHAR(300),
        credencial_id VARCHAR(100),
        criado_em    TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tabela certificados criada');

    // TABELA: idiomas (N:1 com pessoas)
    await client.query(`
      CREATE TABLE IF NOT EXISTS idiomas (
        id        SERIAL PRIMARY KEY,
        pessoa_id INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
        idioma    VARCHAR(80) NOT NULL,
        nivel     VARCHAR(30) CHECK (nivel IN ('basico', 'intermediario', 'avancado', 'fluente', 'nativo')) NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tabela idiomas criada');

    await client.query('COMMIT');
    console.log('\n🎉 Migração concluída com sucesso!');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro na migração:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

createTables().catch(() => process.exit(1));