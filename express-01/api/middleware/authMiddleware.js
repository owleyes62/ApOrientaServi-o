import jwt from "jsonwebtoken";

// ─── Rotas públicas (whitelist) ───────────────────────────────────────────────
const PUBLIC_WRITE_ROUTES = [
  { method: "POST", path: "/session" },          // login
  { method: "POST", path: "/session/refresh" },  // refresh
  { method: "POST", path: "/users" },            // cadastro
];

// ─── authMiddleware ──────────────────────────────────────────────────────────
/**
 * Extrai e valida o JWT do header Authorization.
 * Se válido, popula req.context.me com o usuário do banco.
 * Se inválido/expirado, retorna 401.
 * Se ausente, apenas segue (req.context.me fica undefined).
 */
export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next();
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Formato de token inválido. Use: Bearer <token>" });
  }

  const token = parts[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await req.context.models.User.findByPk(payload.id);

    if (!user) {
      return res.status(401).json({ error: "Usuário do token não encontrado." });
    }

    req.context.me = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

// ─── protectRoutes ────────────────────────────────────────────────────────────
/**
 * Middleware global de proteção de rotas.
 *
 * Regras:
 * - POST/PUT/DELETE → exige autenticação, EXCETO as rotas da whitelist
 * - GET /session    → exige autenticação
 * - Demais GETs     → públicos
 */
export const protectRoutes = (req, res, next) => {
  const method = req.method;
  const path = req.path;

  const isPublicWriteRoute = PUBLIC_WRITE_ROUTES.some(
    (route) => route.method === method && route.path === path
  );

  if (isPublicWriteRoute) {
    return next();
  }

  if (["POST", "PUT", "DELETE"].includes(method)) {
    if (!req.context.me) {
      return res.status(401).json({ error: "Não autorizado. Faça login para continuar." });
    }
    return next();
  }


  if (method === "GET" && path === "/session") {
    if (!req.context.me) {
      return res.status(401).json({ error: "Não autorizado. Faça login para ver sua sessão." });
    }
    return next();
  }

  return next();
};