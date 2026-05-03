const express = require('express');
const router = express.Router();

const pessoasCtrl = require('../controllers/pessoasController');
const projetosCtrl = require('../controllers/projetosController');
const criarController = require('../controllers/genericController');

// ---- Controllers gerados pelo factory ----
const experienciasCtrl = criarController('experiencias',
  ['empresa', 'cargo', 'data_inicio'],
  ['empresa', 'cargo', 'descricao', 'data_inicio', 'data_fim', 'atual', 'modalidade']
);

const formacoesCtrl = criarController('formacoes',
  ['instituicao', 'curso', 'grau', 'data_inicio'],
  ['instituicao', 'curso', 'grau', 'descricao', 'data_inicio', 'data_fim', 'em_andamento']
);

const habilidadesCtrl = criarController('habilidades',
  ['nome'],
  ['nome', 'nivel', 'categoria']
);

const certificadosCtrl = criarController('certificados',
  ['nome', 'emissor'],
  ['nome', 'emissor', 'data_emissao', 'data_expiracao', 'url', 'credencial_id']
);

const idiomasCtrl = criarController('idiomas',
  ['idioma', 'nivel'],
  ['idioma', 'nivel']
);

// ============================================================
// ROTAS - PESSOAS
// ============================================================
router.get('/pessoas',              pessoasCtrl.listar);
router.get('/pessoas/:id',          pessoasCtrl.buscarPorId);  // currículo completo
router.post('/pessoas',             pessoasCtrl.criar);
router.put('/pessoas/:id',          pessoasCtrl.atualizar);
router.delete('/pessoas/:id',       pessoasCtrl.deletar);

// ============================================================
// ROTAS - EXPERIÊNCIAS
// ============================================================
router.get('/pessoas/:pessoaId/experiencias',         experienciasCtrl.listar);
router.get('/pessoas/:pessoaId/experiencias/:id',     experienciasCtrl.buscarPorId);
router.post('/pessoas/:pessoaId/experiencias',        experienciasCtrl.criar);
router.put('/pessoas/:pessoaId/experiencias/:id',     experienciasCtrl.atualizar);
router.delete('/pessoas/:pessoaId/experiencias/:id',  experienciasCtrl.deletar);

// ============================================================
// ROTAS - FORMAÇÕES
// ============================================================
router.get('/pessoas/:pessoaId/formacoes',            formacoesCtrl.listar);
router.get('/pessoas/:pessoaId/formacoes/:id',        formacoesCtrl.buscarPorId);
router.post('/pessoas/:pessoaId/formacoes',           formacoesCtrl.criar);
router.put('/pessoas/:pessoaId/formacoes/:id',        formacoesCtrl.atualizar);
router.delete('/pessoas/:pessoaId/formacoes/:id',     formacoesCtrl.deletar);

// ============================================================
// ROTAS - HABILIDADES
// ============================================================
router.get('/pessoas/:pessoaId/habilidades',          habilidadesCtrl.listar);
router.get('/pessoas/:pessoaId/habilidades/:id',      habilidadesCtrl.buscarPorId);
router.post('/pessoas/:pessoaId/habilidades',         habilidadesCtrl.criar);
router.put('/pessoas/:pessoaId/habilidades/:id',      habilidadesCtrl.atualizar);
router.delete('/pessoas/:pessoaId/habilidades/:id',   habilidadesCtrl.deletar);

// ============================================================
// ROTAS - PROJETOS (com N:N habilidades)
// ============================================================
router.get('/pessoas/:pessoaId/projetos',             projetosCtrl.listar);
router.get('/pessoas/:pessoaId/projetos/:id',         projetosCtrl.buscarPorId);
router.post('/pessoas/:pessoaId/projetos',            projetosCtrl.criar);
router.put('/pessoas/:pessoaId/projetos/:id',         projetosCtrl.atualizar);
router.delete('/pessoas/:pessoaId/projetos/:id',      projetosCtrl.deletar);

// ============================================================
// ROTAS - CERTIFICADOS
// ============================================================
router.get('/pessoas/:pessoaId/certificados',         certificadosCtrl.listar);
router.get('/pessoas/:pessoaId/certificados/:id',     certificadosCtrl.buscarPorId);
router.post('/pessoas/:pessoaId/certificados',        certificadosCtrl.criar);
router.put('/pessoas/:pessoaId/certificados/:id',     certificadosCtrl.atualizar);
router.delete('/pessoas/:pessoaId/certificados/:id',  certificadosCtrl.deletar);

// ============================================================
// ROTAS - IDIOMAS
// ============================================================
router.get('/pessoas/:pessoaId/idiomas',              idiomasCtrl.listar);
router.get('/pessoas/:pessoaId/idiomas/:id',          idiomasCtrl.buscarPorId);
router.post('/pessoas/:pessoaId/idiomas',             idiomasCtrl.criar);
router.put('/pessoas/:pessoaId/idiomas/:id',          idiomasCtrl.atualizar);
router.delete('/pessoas/:pessoaId/idiomas/:id',       idiomasCtrl.deletar);

module.exports = router;