import { Router } from "express";

const router = Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await req.context.models.User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET user by id
router.get("/:userId", async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// CREATE user
router.post("/", async (req, res) => {
  try {
    const user = await req.context.models.User.create({
      username: req.body.username,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// UPDATE user
router.put("/:userId", async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({
      username: req.body.username,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE user
router.delete("/:userId", async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;