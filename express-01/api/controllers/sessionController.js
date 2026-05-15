import jwt from "jsonwebtoken";
import crypto from "crypto";

// ─── Helpers ────────────────────────────────────────────────────────────────

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION ?? "15m",
  });
};


const generateOpaqueToken = () => {
  return crypto.randomBytes(64).toString("hex");
};


const getRefreshTokenExpiry = () => {
  const days = parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAYS ?? "7", 10);
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
};

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /session — Login
 * Body: { login, password }
 * Retorna: { accessToken, refreshToken }
 */
const loginSession = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: "Login e senha são obrigatórios." });
    }

    const user = await req.context.models.User.findByLogin(login);

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateOpaqueToken();
    const refreshTokenExpiresAt = getRefreshTokenExpiry();

    await user.update({ refreshToken, refreshTokenExpiresAt });

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /session — Logout
 * Body: { refreshToken }
 * Remove o refresh token do banco.
 */
const logoutSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token é obrigatório." });
    }

    const user = await req.context.models.User.findOne({
      where: { refreshToken },
    });

    if (!user) {
   
      return res.status(200).json({ message: "Logout realizado." });
    }

 
    await user.update({ refreshToken: null, refreshTokenExpiresAt: null });

    return res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /session/refresh — Refresh
 * Body: { refreshToken }
 * Verifica o token no banco, gera novo par mantendo a expiração original.
 */
const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token é obrigatório." });
    }


    const user = await req.context.models.User.findOne({
      where: { refreshToken },
    });

    if (!user) {
      return res.status(403).json({ error: "Refresh token inválido ou revogado." });
    }


    const now = new Date();
    if (!user.refreshTokenExpiresAt || user.refreshTokenExpiresAt < now) {

      await user.update({ refreshToken: null, refreshTokenExpiresAt: null });
      return res.status(403).json({ error: "Refresh token expirado. Faça login novamente." });
    }

    const originalExpiry = user.refreshTokenExpiresAt;


    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateOpaqueToken();


    await user.update({
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt: originalExpiry,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /session — Retorna o usuário autenticado atual
 * Requer autenticação (protegido pelo protectRoutes)
 */
const getSession = async (req, res, next) => {
  try {
    const { password, refreshToken, refreshTokenExpiresAt, ...safeUser } = req.context.me.toJSON();
    return res.status(200).json(safeUser);
  } catch (error) {
    next(error);
  }
};

export default {
  loginSession,
  logoutSession,
  refreshSession,
  getSession,
};