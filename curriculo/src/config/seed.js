require('dotenv').config();
const pool = require('./database');

/**
 * Upsert de pessoa pelo email (campo UNIQUE).
 * - Se não existe: insere.
 * - Se já existe: atualiza os campos e APAGA todos os dados vinculados.
 * Isso garante que o seed seja IDEMPOTENTE — pode rodar N vezes sem duplicar.
 */

const bulkInsert = async (client, table, columns, rows) => {
  const values = [];
  const placeholders = rows.map((row, i) => {
    const baseIndex = i * columns.length;

    const rowPlaceholders = row.map((_, j) => {
      return `$${baseIndex + j + 1}`;
    });

    values.push(...row);
    return `(${rowPlaceholders.join(',')})`;
  });

  const query = `
    INSERT INTO ${table} (${columns.join(',')})
    VALUES ${placeholders.join(',')}
  `;

  await client.query(query, values);
};

const upsertPessoa = async (client, dados) => {
  const { nome, titulo, email, telefone, localizacao, linkedin, github, portfolio, resumo } = dados;

  const { rows } = await client.query(`
    INSERT INTO pessoas (nome, titulo, email, telefone, localizacao, linkedin, github, portfolio, resumo)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (email) DO UPDATE SET
      nome          = EXCLUDED.nome,
      titulo        = EXCLUDED.titulo,
      telefone      = EXCLUDED.telefone,
      localizacao   = EXCLUDED.localizacao,
      linkedin      = EXCLUDED.linkedin,
      github        = EXCLUDED.github,
      portfolio     = EXCLUDED.portfolio,
      resumo        = EXCLUDED.resumo,
      atualizado_em = NOW()
    RETURNING id;
  `, [nome, titulo, email, telefone, localizacao, linkedin, github, portfolio, resumo]);

  const { id } = rows[0];

  // Remove dados vinculados antigos para reinserir limpos
  await client.query(`DELETE FROM experiencias WHERE pessoa_id = $1`, [id]);
  await client.query(`DELETE FROM formacoes     WHERE pessoa_id = $1`, [id]);
  await client.query(`DELETE FROM projetos      WHERE pessoa_id = $1`, [id]);
  await client.query(`DELETE FROM habilidades   WHERE pessoa_id = $1`, [id]);
  await client.query(`DELETE FROM certificados  WHERE pessoa_id = $1`, [id]);
  await client.query(`DELETE FROM idiomas       WHERE pessoa_id = $1`, [id]);

  return id;
};

const seed = async () => {
  const client = await pool.connect();

  try {
    console.log('🌱 Iniciando seed do banco de dados...\n');
    await client.query('BEGIN');

    // ================================================
    // PESSOA 1 - Ana Clara (Dev Full Stack)
    // ================================================
    const anaId = await upsertPessoa(client, {
      nome: 'Ana Clara Oliveira', titulo: 'Desenvolvedora Full Stack',
      email: 'ana.clara@email.com', telefone: '+55 81 99999-1111',
      localizacao: 'Recife, PE - Brasil',
      linkedin: 'https://linkedin.com/in/anaclaraoliveira',
      github: 'https://github.com/anaclaradev', portfolio: 'https://anaclara.dev',
      resumo: 'Desenvolvedora Full Stack com 4 anos de experiência, apaixonada por criar soluções web escaláveis e APIs robustas. Experiência sólida com React, Node.js e PostgreSQL. Focada em boas práticas, código limpo e entrega de valor real.',
    });

    await client.query(`
      INSERT INTO experiencias (pessoa_id, empresa, cargo, descricao, data_inicio, data_fim, atual, modalidade) VALUES
        ($1, 'TechRecife Soluções', 'Desenvolvedora Full Stack Pleno', 'Desenvolvimento de plataforma SaaS para gestão de RH com React e Node.js. Criação de APIs REST, integração com serviços de pagamento e relatórios em tempo real. Liderou migração de sistema legado, reduzindo tempo de carregamento em 60%.', '2022-03-01', NULL, TRUE, 'hibrido'),
        ($1, 'Agência Digital Nordeste', 'Desenvolvedora Frontend Junior', 'Desenvolvimento de landing pages e e-commerces com React e Vue.js. Implementação de designs responsivos e otimização de performance (Lighthouse score médio de 90+).', '2020-08-01', '2022-02-28', FALSE, 'presencial'),
        ($1, 'Freelancer', 'Desenvolvedora Web', 'Projetos independentes de sites e sistemas pequenos para clientes locais usando HTML, CSS, JavaScript e PHP.', '2019-01-01', '2020-07-31', FALSE, 'remoto')
    `, [anaId]);

    await client.query(`
      INSERT INTO formacoes (pessoa_id, instituicao, curso, grau, descricao, data_inicio, data_fim, em_andamento) VALUES
        ($1, 'CESAR School', 'Desenvolvimento de Software', 'pos_graduacao', 'Especialização focada em arquitetura de sistemas, cloud e metodologias ágeis.', '2023-02-01', NULL, TRUE),
        ($1, 'Universidade Federal de Pernambuco (UFPE)', 'Sistemas de Informação', 'graduacao', 'Formação completa em computação com ênfase em desenvolvimento de sistemas.', '2016-03-01', '2020-12-15', FALSE),
        ($1, 'Rocketseat', 'Ignite - Trilha React', 'bootcamp', 'Bootcamp intensivo de React, Next.js, TypeScript e testes.', '2022-01-10', '2022-04-30', FALSE)
    `, [anaId]);

    const { rows: habAna } = await client.query(`
      INSERT INTO habilidades (pessoa_id, nome, nivel, categoria) VALUES
        ($1,'JavaScript','avancado','linguagem'), ($1,'TypeScript','avancado','linguagem'),
        ($1,'Python','intermediario','linguagem'), ($1,'React.js','avancado','framework'),
        ($1,'Node.js','avancado','framework'), ($1,'Next.js','intermediario','framework'),
        ($1,'PostgreSQL','avancado','banco_dados'), ($1,'MongoDB','intermediario','banco_dados'),
        ($1,'Docker','intermediario','ferramenta'), ($1,'Git/GitHub','avancado','ferramenta'),
        ($1,'Comunicação','avancado','soft_skill'), ($1,'Trabalho em equipe','especialista','soft_skill')
      RETURNING id, nome;
    `, [anaId]);

    const { rows: [p1] } = await client.query(`
      INSERT INTO projetos (pessoa_id, nome, descricao, url, repositorio, data_inicio, data_fim, em_andamento)
      VALUES ($1,'EduConnect - Plataforma de Cursos Online','Plataforma completa de ensino online com streaming de vídeos, sistema de quizzes, progresso do aluno e certificados. Suporta +500 usuários simultâneos.','https://educonnect.vercel.app','https://github.com/anaclaradev/educonnect','2023-06-01',NULL,TRUE)
      RETURNING id;`, [anaId]);

    const { rows: [p2] } = await client.query(`
      INSERT INTO projetos (pessoa_id, nome, descricao, url, repositorio, data_inicio, data_fim, em_andamento)
      VALUES ($1,'API FinTrack - Controle Financeiro','API REST completa para controle de finanças pessoais com autenticação JWT, relatórios mensais, metas de economia e integração com gráficos.',NULL,'https://github.com/anaclaradev/fintrack-api','2022-11-01','2023-03-30',FALSE)
      RETURNING id;`, [anaId]);

    await client.query(`INSERT INTO projetos_habilidades (projeto_id, habilidade_id) VALUES ($1,$2),($1,$3),($1,$4),($5,$4),($5,$3),($5,$6)`,
      [p1.id, habAna.find(h=>h.nome==='React.js').id, habAna.find(h=>h.nome==='Node.js').id, habAna.find(h=>h.nome==='TypeScript').id, p2.id, habAna.find(h=>h.nome==='PostgreSQL').id]);

    await client.query(`INSERT INTO certificados (pessoa_id, nome, emissor, data_emissao, url, credencial_id) VALUES
      ($1,'AWS Certified Developer – Associate','Amazon Web Services','2023-09-15','https://aws.amazon.com/verify/1234','AWS-DEV-2023-ANA'),
      ($1,'React - Certificação Avançada','Rocketseat','2022-05-01','https://rocketseat.com.br/cert/abc123','RS-REACT-ABC123'),
      ($1,'Scrum Foundation Professional','CertiProf','2021-11-20','https://certiprof.com/verify/xyz','CP-SCRUM-XYZ')`, [anaId]);

    await client.query(`INSERT INTO idiomas (pessoa_id, idioma, nivel) VALUES ($1,'Português','nativo'),($1,'Inglês','avancado'),($1,'Espanhol','intermediario')`, [anaId]);
    console.log(`✅ Ana Clara (id: ${anaId}) cadastrada`);

    // ================================================
    // PESSOA 2 - Bruno Mendes (Dev Mobile / Backend)
    // ================================================
    const brunoId = await upsertPessoa(client, {
      nome: 'Bruno Mendes Silva', titulo: 'Desenvolvedor Mobile & Backend',
      email: 'bruno.mendes@email.com', telefone: '+55 81 98888-2222',
      localizacao: 'João Pessoa, PB - Brasil',
      linkedin: 'https://linkedin.com/in/brunomendesdev',
      github: 'https://github.com/brunomendesdev', portfolio: null,
      resumo: 'Desenvolvedor com 5 anos de experiência focado em mobile (React Native) e backend (Java Spring Boot). Entusiasta de arquitetura limpa e DevOps. Já entregou aplicativos com mais de 100 mil downloads na Play Store e App Store.',
    });

    await client.query(`
      INSERT INTO experiencias (pessoa_id, empresa, cargo, descricao, data_inicio, data_fim, atual, modalidade) VALUES
        ($1,'Startup Fintec Nordeste','Tech Lead Mobile','Liderança técnica de time de 5 devs no desenvolvimento do super app de finanças com React Native. Responsável por arquitetura, code review, CI/CD e integração com APIs bancárias (PIX, Open Banking).','2021-09-01',NULL,TRUE,'remoto'),
        ($1,'Empresa de Telecomunicações','Desenvolvedor Backend Java','Desenvolvimento e manutenção de microsserviços com Spring Boot para sistema de billing. Processamento de +1 milhão de transações/dia com alta disponibilidade (99.9% uptime).','2019-05-01','2021-08-31',FALSE,'presencial'),
        ($1,'CESAR - Centro de Inovação','Estagiário de Desenvolvimento','Contribuição em projetos de pesquisa e inovação com foco em IoT e aplicativos móveis. Desenvolvimento de protótipos com Android nativo e Arduino.','2018-03-01','2019-04-30',FALSE,'presencial')
    `, [brunoId]);

    await client.query(`
      INSERT INTO formacoes (pessoa_id, instituicao, curso, grau, descricao, data_inicio, data_fim, em_andamento) VALUES
        ($1,'Universidade Federal da Paraíba (UFPB)','Ciência da Computação','graduacao','Formação com foco em algoritmos, estrutura de dados e sistemas distribuídos.','2015-03-01','2019-12-20',FALSE),
        ($1,'Alura','Formação Java e Spring Boot','curso','Trilha completa de desenvolvimento backend com Java, Spring Framework, JPA/Hibernate e REST APIs.','2020-01-01','2020-08-31',FALSE),
        ($1,'Udemy','React Native - Desenvolvimento Mobile','curso','Curso completo de desenvolvimento mobile multiplataforma com React Native e Expo.','2021-01-01','2021-06-30',FALSE)
    `, [brunoId]);

    const { rows: habBruno } = await client.query(`
      INSERT INTO habilidades (pessoa_id, nome, nivel, categoria) VALUES
        ($1,'Java','especialista','linguagem'), ($1,'JavaScript','avancado','linguagem'),
        ($1,'Kotlin','intermediario','linguagem'), ($1,'React Native','especialista','framework'),
        ($1,'Spring Boot','especialista','framework'), ($1,'Expo','avancado','framework'),
        ($1,'PostgreSQL','avancado','banco_dados'), ($1,'Redis','intermediario','banco_dados'),
        ($1,'Docker','avancado','ferramenta'), ($1,'Kubernetes','basico','ferramenta'),
        ($1,'Jenkins/GitHub Actions','intermediario','ferramenta'),
        ($1,'Liderança técnica','avancado','soft_skill'), ($1,'Mentoria','intermediario','soft_skill')
      RETURNING id, nome;
    `, [brunoId]);

    const { rows: [p3] } = await client.query(`
      INSERT INTO projetos (pessoa_id, nome, descricao, url, repositorio, data_inicio, data_fim, em_andamento)
      VALUES ($1,'PagaBoleto App - Super App Financeiro','Aplicativo mobile de finanças pessoais com funcionalidades de pagamento de boletos via câmera, extrato, investimentos e cartão virtual. +120k downloads.','https://pagaboleto.app',NULL,'2021-10-01',NULL,TRUE)
      RETURNING id;`, [brunoId]);

    const { rows: [p4] } = await client.query(`
      INSERT INTO projetos (pessoa_id, nome, descricao, url, repositorio, data_inicio, data_fim, em_andamento)
      VALUES ($1,'DevBlog API - Sistema de Blog com Microsserviços','API baseada em microsserviços com Spring Boot para plataforma de blog. Serviços separados de usuários, posts, comentários e notificações via RabbitMQ.',NULL,'https://github.com/brunomendesdev/devblog-api','2020-09-01','2021-05-30',FALSE)
      RETURNING id;`, [brunoId]);

    await client.query(`INSERT INTO projetos_habilidades (projeto_id, habilidade_id) VALUES ($1,$2),($1,$3),($4,$5),($4,$6),($4,$7)`,
      [p3.id, habBruno.find(h=>h.nome==='React Native').id, habBruno.find(h=>h.nome==='Expo').id,
       p4.id, habBruno.find(h=>h.nome==='Java').id, habBruno.find(h=>h.nome==='Spring Boot').id, habBruno.find(h=>h.nome==='PostgreSQL').id]);

    await client.query(`INSERT INTO certificados (pessoa_id, nome, emissor, data_emissao, url, credencial_id) VALUES
      ($1,'Oracle Certified Professional Java SE 11','Oracle','2020-10-10','https://oracle.com/cert/java-se11-bruno','OCP-JAVA11-BRU'),
      ($1,'Google Associate Android Developer','Google','2022-03-05','https://google.com/cert/android-bruno','GGL-AND-2022'),
      ($1,'Docker Certified Associate','Docker Inc.','2023-01-20','https://docker.com/cert/dca-bruno','DCA-2023-BRU')`, [brunoId]);

    await client.query(`INSERT INTO idiomas (pessoa_id, idioma, nivel) VALUES ($1,'Português','nativo'),($1,'Inglês','fluente'),($1,'Alemão','basico')`, [brunoId]);
    console.log(`✅ Bruno Mendes (id: ${brunoId}) cadastrado`);

    // ================================================
    // PESSOA 3 - Iwerson Guilherme (Dev Back-end / IA)
    // ================================================
    const iwersonId = await upsertPessoa(client, {
      nome: 'Iwerson Guilherme',
      titulo: 'Desenvolvedor Back-end com foco em Inteligência Artificial Conversacional',
      email: 'iwersongss@gmail.com', telefone: '+55 81 989470811',
      localizacao: 'Jaboatão dos Guararapes, PE - Brasil',
      linkedin: 'https://linkedin.com/in/iwersonguilherme',
      github: 'https://github.com/iwersonguilherme', portfolio: null,
      resumo: 'Desenvolvedor Back-end com foco em Inteligência Artificial Conversacional e desenvolvimento de aplicações que integram modelos de IA para resolver problemas reais. Experiência prática em Python, FastAPI, Django e SQL, com uso de ferramentas como DeepEval, N8n e Engenharia de Prompt. Perfil analítico com foco em qualidade, testes e melhoria contínua de sistemas.',
    });

    await client.query(`
      INSERT INTO experiencias (pessoa_id, empresa, cargo, descricao, data_inicio, data_fim, atual, modalidade)
      VALUES ($1,'Bolsista','AI QA Engineer (Test Automation & Observability)',
        'Desenvolvimento e evolução de plataforma de testes para sistemas de IA conversacional. Criação de métricas e avaliação de qualidade de respostas utilizando DeepEval. Implementação de testes automatizados (TESTE_FIXO e AI-to-AI) para validação de agentes. Análise de fluxos conversacionais e identificação de falhas em respostas de IA. Estruturação de casos de teste e definição de critérios de validação. Participação em reuniões de alinhamento e organização de backlog.',
        '2025-05-01',NULL,TRUE,'remoto')
    `, [iwersonId]);

    await client.query(`
      INSERT INTO formacoes (pessoa_id, instituicao, curso, grau, descricao, data_inicio, data_fim, em_andamento)
      VALUES ($1,'UNICAP - Universidade Católica de Pernambuco','Sistemas para Internet','graduacao',
        'Tecnólogo em Sistemas para Internet com foco em desenvolvimento web e aplicações.','2024-08-01','2027-03-01',TRUE)
    `, [iwersonId]);

    const { rows: habIwerson } = await client.query(`
      INSERT INTO habilidades (pessoa_id, nome, nivel, categoria) VALUES
        ($1,'Python','avancado','linguagem'), ($1,'Java','intermediario','linguagem'),
        ($1,'SQL','intermediario','banco_dados'), ($1,'Django','avancado','framework'),
        ($1,'FastAPI','avancado','framework'), ($1,'Spring','basico','framework'),
        ($1,'DeepEval','avancado','ferramenta'), ($1,'N8n','avancado','ferramenta'),
        ($1,'Engenharia de Prompt','avancado','ferramenta'), ($1,'Scrum','intermediario','outro')
      RETURNING id, nome;
    `, [iwersonId]);

    const { rows: [p5] } = await client.query(`
      INSERT INTO projetos (pessoa_id, nome, descricao, url, repositorio, data_inicio, data_fim, em_andamento)
      VALUES ($1,'Plataforma de Avaliação de IA Conversacional','Plataforma completa de testes para agentes de IA com dois modos de execução: replay de conversas fixas e simulação dinâmica AI-to-AI via N8n. Pipeline de avaliação com métricas via DeepEval, banco de dados e dashboard com visualização de resultados, taxa de sucesso, custo e análise de falhas.',NULL,NULL,'2025-05-01',NULL,TRUE)
      RETURNING id;`, [iwersonId]);

    const { rows: [p6] } = await client.query(`
      INSERT INTO projetos (pessoa_id, nome, descricao, url, repositorio, data_inicio, data_fim, em_andamento)
      VALUES ($1,'Sistema de Acompanhamento de Plantas Forrageiras','Aplicação desenvolvida em parceria com docente da UFPE para digitalizar registros de campo, com dois perfis de usuário: alunos e professora. Suporte a modo offline com sincronização automática, autenticação individual e histórico de períodos por turma.',NULL,NULL,'2024-08-01',NULL,FALSE)
      RETURNING id;`, [iwersonId]);

    const { rows: [p7] } = await client.query(`
      INSERT INTO projetos (pessoa_id, nome, descricao, url, repositorio, data_inicio, data_fim, em_andamento)
      VALUES ($1,'DeckPilot - Sistema de Construção de Deck para Cardgames','Aplicação web com agente de IA conversacional para geração e avaliação de decks de Yu-Gi-Oh!, desenvolvida com Python e FastAPI. MVP funcional entregue com fluxo completo de geração, refinamento e avaliação automática de decks via módulo Deck Doctor. Em desenvolvimento ativo, com previsão de modelo de IA próprio para o domínio.',NULL,NULL,'2024-01-01',NULL,TRUE)
      RETURNING id;`, [iwersonId]);

    const pyId     = habIwerson.find(h=>h.nome==='Python').id;
    const faId     = habIwerson.find(h=>h.nome==='FastAPI').id;
    const deepId   = habIwerson.find(h=>h.nome==='DeepEval').id;
    const n8nId    = habIwerson.find(h=>h.nome==='N8n').id;
    const sqlId    = habIwerson.find(h=>h.nome==='SQL').id;
    const promptId = habIwerson.find(h=>h.nome==='Engenharia de Prompt').id;

    await client.query(`INSERT INTO projetos_habilidades (projeto_id, habilidade_id) VALUES
      ($1,$4),($1,$5),($1,$6),($1,$7),
      ($2,$4),($2,$8),
      ($3,$4),($3,$5),($3,$6),($3,$9)`,
      [p5.id, p6.id, p7.id, pyId, deepId, n8nId, promptId, sqlId, faId]);

    await client.query(`INSERT INTO idiomas (pessoa_id, idioma, nivel) VALUES ($1,'Português','nativo'),($1,'Inglês','intermediario')`, [iwersonId]);

    await client.query('COMMIT');
    console.log(`✅ Iwerson Guilherme (id: ${iwersonId}) cadastrado`);
    console.log('\n🎉 Seed concluído! Três currículos cadastrados com sucesso.');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro no seed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

seed().catch(() => process.exit(1));