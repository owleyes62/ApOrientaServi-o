require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ROTA DE HEALTH CHECK
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    mensagem: '🎓 API de Currículo - Express + NeonDB',
    versao: '1.0.0',
    endpoints: {
      pessoas:      'GET|POST /api/pessoas',
      curriculo:    'GET      /api/pessoas/:id  (currículo completo)',
      experiencias: '/api/pessoas/:pessoaId/experiencias',
      formacoes:    '/api/pessoas/:pessoaId/formacoes',
      habilidades:  '/api/pessoas/:pessoaId/habilidades',
      projetos:     '/api/pessoas/:pessoaId/projetos',
      certificados: '/api/pessoas/:pessoaId/certificados',
      idiomas:      '/api/pessoas/:pessoaId/idiomas',
    }
  });
});

// ROTAS DA API
app.use('/api', routes);

// MIDDLEWARE DE ERROS 404
app.use((req, res) => {
  res.status(404).json({ sucesso: false, erro: `Rota ${req.method} ${req.path} não encontrada` });
});

// MIDDLEWARE DE ERROS GLOBAIS
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
});

// INICIA O SERVIDOR
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Documentação: http://localhost:${PORT}/\n`);
});

module.exports = app;