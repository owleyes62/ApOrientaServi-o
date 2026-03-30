export default function errorHandler(err, req, res, next) {
  console.error(err); // log pra debug

  const status = err.status || 500;

  switch (status) {
    case 400:
      return res.status(400).json({
        error: "Bad Request",
        message: err.message || "Requisição inválida",
      });

    case 409:
      return res.status(409).json({
        error: "Conflict",
        message: err.message || "Conflito de dados",
      });

    case 500:
    default:
      return res.status(500).json({
        error: "Internal Server Error",
        message: err.message || "Erro interno do servidor",
      });
  }
}