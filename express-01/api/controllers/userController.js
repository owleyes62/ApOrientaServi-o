import userService from "../services/userService";

const listarUsers = async (req, res, next) => {
  try {
    const users = await userService.listarUsers();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const buscarUserPorId = async (req, res, next) => {
  try {
    const user = await userService.buscarUserPorId(req.params.userId);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const criarUser = async (req, res, next) => {
  try {
    const user = await userService.criarUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const atualizarUser = async (req, res, next) => {
  try {
    const user = await userService.atualizarUser(req.params.userId, req.body);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deletarUser = async (req, res, next) => {
  try {
    const resultado = await userService.deletarUser(req.params.userId);
    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export default {
  listarUsers,
  buscarUserPorId,
  criarUser,
  atualizarUser,
  deletarUser,
};