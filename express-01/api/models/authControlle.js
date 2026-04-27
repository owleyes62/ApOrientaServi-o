import jwt from 'jsonwebtoken';

// Funções auxiliares para gerar os tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id }, 'SUA_CHAVE_ACCESS', { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, 'SUA_CHAVE_REFRESH', { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// 1. ROTA DE LOGIN
export const login = async (req, res, models) => {
  const { login, password } = req.body;
  const user = await models.User.findByLogin(login);

  if (!user || !(await user.validatePassword(password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const tokens = generateTokens(user);

  await user.update({ refreshToken: tokens.refreshToken });

  res.json(tokens);
};

// 2. ROTA DE REFRESH (A renovação)
export const refresh = async (req, res, models) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ error: 'Token necessário' });

  try {
    const decoded = jwt.verify(refreshToken, 'SUA_CHAVE_REFRESH');

    const user = await models.User.findByPk(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Refresh Token inválido ou revogado' });
    }

    // 3. Se tudo estiver ok, gera um NOVO Access Token
    const accessToken = jwt.sign({ id: user.id }, 'SUA_CHAVE_ACCESS', { expiresIn: '15m' });
    
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: 'Token expirado' });
  }
};
