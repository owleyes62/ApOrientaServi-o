import "dotenv/config";
import cors from "cors";
import express from "express";
import models, { sequelize } from "./models";
import routes from "./routes";
import components from "./components";
import { errorHandler } from "./middleware";
import { authMiddleware, protectRoutes } from "./middleware/authMiddleware";

const app = express();
app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Contexto base (sem usuário fixo)
app.use((req, res, next) => {
  req.context = {
    models,
  };
  next();
});

app.use(authMiddleware);
app.use(protectRoutes);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.get("/", (req, res) => {
  const html = components.buildHomePage(components.routesInfo);
  res.send(html);
});

// Rotas da API
app.use("/session", routes.session);
app.use("/users", routes.user);
app.use("/messages", routes.message);
app.use("/tarefas", routes.tarefa);

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
const eraseDatabaseOnSync = process.env.ERASE_DATABASE_ON_SYNC === "true";

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    await createUsersWithMessages();
  }
  app.listen(port, () =>
    console.log(
      "Express-01 app listening on port " + port + "!\n" + process.env.MESSAGE
    )
  );
});

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: "rwieruch",
      email: "rwieruch@email.com",
      password: "password123", 
      messages: [
        {
          text: "Published the Road to learn React",
        },
      ],
    },
    {
      include: [models.Message],
    }
  );

  await models.User.create(
    {
      username: "ddavids",
      email: "ddavids@email.com",
      password: "password123",
      messages: [
        {
          text: "Happy to release ...",
        },
        {
          text: "Published a complete ...",
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
};

export default app;