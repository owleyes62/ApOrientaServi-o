import models from "../models";

const listarTarefas = async () => {
  return await models.Tarefa.findAll();
};

const buscarTarefaPorId = async (objectId) => {
  const tarefa = await models.Tarefa.findByPk(objectId);
  if (!tarefa) {
    const error = new Error("Tarefa não encontrada");
    error.status = 404;
    throw error;
  }
  return tarefa;
};

const criarTarefa = async ({ titulo, descricao, concluida }) => {
  if (!titulo) {
    const error = new Error("O título é obrigatório");
    error.status = 400;
    throw error;
  }
  if (!descricao) {
    const error = new Error("A descrição é obrigatória");
    error.status = 400;
    throw error;
  }
  return await models.Tarefa.create({ titulo, descricao, concluida });
};

const atualizarTarefa = async (objectId, { titulo, descricao, concluida }) => {
  const tarefa = await models.Tarefa.findByPk(objectId);
  if (!tarefa) {
    const error = new Error("Tarefa não encontrada");
    error.status = 404;
    throw error;
  }
  if (titulo !== undefined) tarefa.titulo = titulo;
  if (descricao !== undefined) tarefa.descricao = descricao;
  if (concluida !== undefined) tarefa.concluida = concluida;
  await tarefa.save();
  return tarefa;
};

const deletarTarefa = async (objectId) => {
  const tarefa = await models.Tarefa.findByPk(objectId);
  if (!tarefa) {
    const error = new Error("Tarefa não encontrada");
    error.status = 404;
    throw error;
  }
  await tarefa.destroy();
  return { message: "Tarefa deletada com sucesso" };
};

export default {
  listarTarefas,
  buscarTarefaPorId,
  criarTarefa,
  atualizarTarefa,
  deletarTarefa,
};
