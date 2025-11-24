const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "devops_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (important pour Kubernetes)
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Metrics endpoint (pour Prometheus)
app.get("/metrics", (req, res) => {
  res
    .status(200)
    .send(
      "# HELP api_requests_total Total API requests\n# TYPE api_requests_total counter\napi_requests_total 0\n"
    );
});

// Routes API

// GET - Récupérer toutes les tâches
app.get("/api/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des todos:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST - Créer une nouvelle tâche
app.post("/api/todos", async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Le titre est requis" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO todos (title, description, completed) VALUES ($1, $2, $3) RETURNING *",
      [title, description || "", false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la création du todo:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT - Mettre à jour une tâche
app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const result = await pool.query(
      "UPDATE todos SET title = COALESCE($1, title), description = COALESCE($2, description), completed = COALESCE($3, completed) WHERE id = $4 RETURNING *",
      [title, description, completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du todo:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE - Supprimer une tâche
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    res.json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du todo:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Initialisation de la base de données
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Table todos créée ou déjà existante");
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'initialisation de la base de données:",
      error
    );
  }
};

// Démarrage du serveur
app.listen(PORT, async () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  await initDatabase();
});

module.exports = app;
