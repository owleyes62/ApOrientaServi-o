import tarefaService from "../services/tarefaService";

const listarTarefas = async (req, res, next) => {
  try {
    const tarefas = await tarefaService.listarTarefas();
    return res.status(200).json(tarefas);
  } catch (error) {
    next(error);
  }
};

const buscarTarefaPorId = async (req, res, next) => {
  try {
    const tarefa = await tarefaService.buscarTarefaPorId(req.params.objectId);
    return res.status(200).json(tarefa);
  } catch (error) {
    next(error);
  }
};

const criarTarefa = async (req, res, next) => {
  try {
    const tarefa = await tarefaService.criarTarefa(req.body);
    return res.status(201).json(tarefa);
  } catch (error) {
    next(error);
  }
};

const atualizarTarefa = async (req, res, next) => {
  try {
    const tarefa = await tarefaService.atualizarTarefa(
      req.params.objectId,
      req.body
    );
    return res.status(200).json(tarefa);
  } catch (error) {
    next(error);
  }
};

const deletarTarefa = async (req, res, next) => {
  try {
    const resultado = await tarefaService.deletarTarefa(req.params.objectId);
    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export default {
  listarTarefas,
  buscarTarefaPorId,
  criarTarefa,
  atualizarTarefa,
  deletarTarefa,
};
