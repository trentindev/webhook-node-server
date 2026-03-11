import express from "express";
import SmeeClient from "smee-client";

const WEBHOOK_PROXY_URL = "https://smee.io/3zN8KbWuTAkjCjR";
const app = express();
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

const smee = new SmeeClient({
  source: WEBHOOK_PROXY_URL,
  target: "http://localhost:3000/webhook",
  logger: console,
});

smee.start();

app.use(express.json());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Serveur webhook actif");
});

app.post("/webhook", (req, res) => {
  let payload = req.body;

  if (typeof req.body.payload === "string") {
    payload = JSON.parse(req.body.payload);
  }

  const branch = payload.ref ?? "inconnue";
  const repository = payload.repository?.full_name ?? "inconnu";
  const pusher = payload.pusher?.name ?? "inconnu";
  const headCommitMessage = payload.head_commit?.message ?? "aucun message";
  const modifiedFiles = payload.head_commit?.modified ?? [];

  console.log("Webhook reçu");
  console.log("Branche :", branch);
  console.log("Dépôt :", repository);
  console.log("Auteur du push :", pusher);
  console.log("Message du commit :", headCommitMessage);
  console.log("Fichiers modifiés :", modifiedFiles);

  res.status(200).json({
    status: "ok",
    message: "Webhook reçu avec succès",
  });
});

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
