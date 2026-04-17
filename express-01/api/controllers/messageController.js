import messageService from "../services/messageService";

const listarMessages = async (req, res, next) => {
  try {
    const messages = await messageService.listarMessages();
    return res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

const buscarMessagePorId = async (req, res, next) => {
  try {
    const message = await messageService.buscarMessagePorId(req.params.messageId);
    return res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

const criarMessage = async (req, res, next) => {
  try {
    const message = await messageService.criarMessage(req.body);
    return res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

const atualizarMessage = async (req, res, next) => {
  try {
    const message = await messageService.atualizarMessage(
      req.params.messageId,
      req.body
    );
    return res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

const deletarMessage = async (req, res, next) => {
  try {
    const resultado = await messageService.deletarMessage(req.params.messageId);
    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export default {
  listarMessages,
  buscarMessagePorId,
  criarMessage,
  atualizarMessage,
  deletarMessage,
};