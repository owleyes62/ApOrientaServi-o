import { Router } from "express";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await req.context.models.User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
});


router.get("/:userId", async (req, res, next) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error); 
  }
});


router.post("/", async (req, res, next) => {
  try {
    const user = await req.context.models.User.create({
      username: req.body.username,
      email: req.body.email,
    });

    if(email) {
      const existingUser = await req.context.models.User.findOne({ where: { email: req.body.email } });
      if (existingUser) {
        next({ status: 409, message: "Email já em uso" });
        return;
      }
    }

    return res.status(201).json(user);
  } catch (error) {
    console.log("ERRO: 500", error);
    next(error);
  }
});

router.put("/:userId", async (req, res, next) => {
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
    next(error);
  }
});

router.delete("/:userId", async (req, res, next) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await user.destroy();

    return res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    next(error);
  }
});

export default router;