import models from "../models";

const listarMessages = async () => {
  return await models.Message.findAll();
};

const buscarMessagePorId = async (messageId) => {
  const message = await models.Message.findByPk(messageId);
  if (!message) {
    const error = new Error("Mensagem não encontrada");
    error.status = 404;
    throw error;
  }
  return message;
};

const criarMessage = async ({ text, userId }) => {
  if (!text) {
    const error = new Error("O texto é obrigatório");
    error.status = 400;
    throw error;
  }
  if (!userId) {
    const error = new Error("O userId é obrigatório");
    error.status = 400;
    throw error;
  }
  const user = await models.User.findByPk(userId);
  if (!user) {
    const error = new Error("Usuário não encontrado");
    error.status = 404;
    throw error;
  }
  return await models.Message.create({ text, userId });
};

const atualizarMessage = async (messageId, { text, userId }) => {
  const message = await models.Message.findByPk(messageId);
  if (!message) {
    const error = new Error("Mensagem não encontrada");
    error.status = 404;
    throw error;
  }
  if (userId) {
    const user = await models.User.findByPk(userId);
    if (!user) {
      const error = new Error("Usuário não encontrado");
      error.status = 404;
      throw error;
    }
    message.userId = userId;
  }
  if (text !== undefined) message.text = text;
  await message.save();
  return message;
};

const deletarMessage = async (messageId) => {
  const message = await models.Message.findByPk(messageId);
  if (!message) {
    const error = new Error("Mensagem não encontrada");
    error.status = 404;
    throw error;
  }
  await message.destroy();
  return { message: "Mensagem deletada com sucesso" };
};

export default {
  listarMessages,
  buscarMessagePorId,
  criarMessage,
  atualizarMessage,
  deletarMessage,
};