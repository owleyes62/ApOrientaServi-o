require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const routes = require('../src/routes');

const app = express();

// ── Middlewares ───────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ── Health check ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status:   'online',
    mensagem: '🎓 API de Currículo - Express + NeonDB (Vercel)',
    versao:   '1.0.0',
    endpoints: {
      pessoas:      'GET|POST /api/pessoas',
      curriculo:    'GET      /api/pessoas/:id  (currículo completo)',
      experiencias: '/api/pessoas/:pessoaId/experiencias',
      formacoes:    '/api/pessoas/:pessoaId/formacoes',
      habilidades:  '/api/pessoas/:pessoaId/habilidades',
      projetos:     '/api/pessoas/:pessoaId/projetos',
      certificados: '/api/pessoas/:pessoaId/certificados',
      idiomas:      '/api/pessoas/:pessoaId/idiomas',
    },
  });
});

// ── Rotas da API ──────────────────────────────────────────
app.use('/api', routes);

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ sucesso: false, erro: `Rota ${req.method} ${req.path} não encontrada` });
});

// ── Erros globais ─────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
});

// ── Exporta para o Vercel (sem app.listen!) ───────────────
module.exports = app;