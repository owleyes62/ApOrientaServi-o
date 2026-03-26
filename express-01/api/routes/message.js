import { Router } from "express";

const router = Router();


router.get("/", async (req, res) => {
  try {
    const messages = await req.context.models.Message.findAll();
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.get("/:messageId", async (req, res) => {
  try {
    const message = await req.context.models.Message.findByPk(
      req.params.messageId
    );

    if (!message) {
      return res.status(404).json({ message: "Mensagem não encontrada" });
    }

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { text, userId } = req.body;

    // Verifica se o usuário existe
    const user = await req.context.models.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const message = await req.context.models.Message.create({
      text,
      userId,
    });

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/:messageId", async (req, res) => {
  try {
    const { text, userId } = req.body;

    const message = await req.context.models.Message.findByPk(
      req.params.messageId
    );

    if (!message) {
      return res.status(404).json({ message: "Mensagem não encontrada" });
    }

    // Se quiser permitir alterar o userId, validamos
    if (userId) {
      const user = await req.context.models.User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      message.userId = userId;
    }

    if (text) {
      message.text = text;
    }

    await message.save();

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.delete("/:messageId", async (req, res) => {
  try {
    const message = await req.context.models.Message.findByPk(
      req.params.messageId
    );

    if (!message) {
      return res.status(404).json({ message: "Mensagem não encontrada" });
    }

    await message.destroy();

    return res.status(200).json({ message: "Mensagem deletada com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;