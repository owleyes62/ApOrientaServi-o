import models from "../models";

const listarUsers = async () => {
  return await models.User.findAll();
};

const buscarUserPorId = async (userId) => {
  const user = await models.User.findByPk(userId);
  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.status = 404;
    throw error;
  }
  return user;
};

const criarUser = async ({ username, email }) => {
  if (!username) {
    const error = new Error("O username é obrigatório");
    error.status = 400;
    throw error;
  }
  if (!email) {
    const error = new Error("O email é obrigatório");
    error.status = 400;
    throw error;
  }
  const existingUser = await models.User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error("Email já em uso");
    error.status = 409;
    throw error;
  }
  return await models.User.create({ username, email });
};

const atualizarUser = async (userId, { username, email }) => {
  const user = await models.User.findByPk(userId);
  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.status = 404;
    throw error;
  }
  if (username !== undefined) user.username = username;
  if (email !== undefined) user.email = email;
  await user.save();
  return user;
};

const deletarUser = async (userId) => {
  const user = await models.User.findByPk(userId);
  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.status = 404;
    throw error;
  }
  await user.destroy();
  return { message: "Usuário deletado com sucesso" };
};

export default {
  listarUsers,
  buscarUserPorId,
  criarUser,
  atualizarUser,
  deletarUser,
};