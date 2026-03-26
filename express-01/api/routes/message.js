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

// CREATE message
router.post("/", async (req, res) => {
  try {
    const message = await req.context.models.Message.create({
      text: req.body.text,
      userId: req.context.me.id, // usuário logado fixo no contexto
    });

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// UPDATE message
router.put("/:messageId", async (req, res) => {
  try {
    const message = await req.context.models.Message.findByPk(
      req.params.messageId
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.update({
      text: req.body.text,
    });

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