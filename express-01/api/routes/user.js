import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await req.context.models.User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.get("/:userId", async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const user = await req.context.models.User.create({
      username: req.body.username,
      email: req.body.email,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await user.update({
      username: req.body.username,
      email: req.body.email,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await user.destroy();

    return res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;