import { Router } from "express";

const router = Router();

// GET all messages
router.get("/", async (req, res) => {
  try {
    const messages = await req.context.models.Message.findAll();
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET message by id
router.get("/:messageId", async (req, res) => {
  try {
    const message = await req.context.models.Message.findByPk(
      req.params.messageId
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
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
      return res.status(404).json({ message: "User not found" });
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
      return res.status(404).json({ message: "Message not found" });
    }

    // Se quiser permitir alterar o userId, validamos
    if (userId) {
      const user = await req.context.models.User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
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

// DELETE message
router.delete("/:messageId", async (req, res) => {
  try {
    const message = await req.context.models.Message.findByPk(
      req.params.messageId
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.destroy();

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;