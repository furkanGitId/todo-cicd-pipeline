const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* GET all todos */
app.get("/todos", (req, res) => {
  db.all("SELECT * FROM todos ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

/* CREATE todo */
app.post("/todos", (req, res) => {
  const { title } = req.body;

  if (!title) return res.status(400).json({ message: "Title required" });

  db.run(
    "INSERT INTO todos (title, completed) VALUES (?, 0)",
    [title],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID, title, completed: 0 });
    },
  );
});

/* UPDATE todo (edit OR toggle) */
app.put("/todos/:id", (req, res) => {
  const { title, completed } = req.body;

  db.run(
    `UPDATE todos 
     SET title = COALESCE(?, title),
         completed = COALESCE(?, completed)
     WHERE id = ?`,
    [title, completed, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    },
  );
});

/* DELETE todo */
app.delete("/todos/:id", (req, res) => {
  db.run("DELETE FROM todos WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000"),
);
