import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Rodando na porta ${port}`));

export default app;