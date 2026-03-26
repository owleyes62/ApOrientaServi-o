import "dotenv/config";
import cors from "cors";
import express from "express";

import models, { sequelize } from "./models";
import routes from "./routes";
import components from "./components";

const app = express();
app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(async (req, res, next) => {
  req.context = {
    models,
    me: await models.User.findByLogin("rwieruch"),
  };
  next();
});
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});


// Visual improvisado para mostrar as rotas disponíveis na raiz do servidor
app.get("/", (req, res) => {
  const html = components.buildHomePage(components.routesInfo);
  res.send(html);
});
app.get("/", (req, res) => {
  res.json(components.routesInfo);
});

// Rotas da API
app.use("/session", routes.session);
app.use("/users", routes.user);
app.use("/messages", routes.message);

// Rota de teste para verificar se o servidor está rodando e mostrar a variável de ambiente
app.get("/", (req, res) => {
  res.send(
    "Received a GET HTTP method\nServidor rodando!\n" + process.env.MESSAGE,
  );
});

const port = process.env.PORT ?? 3000;
const eraseDatabaseOnSync = process.env.ERASE_DATABASE_ON_SYNC === "true";

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  app.listen(port, () =>
    console.log(
      "Express-01 app listening on port " + port + "!\n" + process.env.MESSAGE,
    ),
  );
});

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: "rwieruch",
      email: "rwieruch@email.com",
      messages: [
        {
          text: "Published the Road to learn React",
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: "ddavids",
      email: "ddavids@email.com",
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
    },
  );
};

export default app;