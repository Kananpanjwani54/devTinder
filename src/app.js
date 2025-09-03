const express = require("express");

// create app
const app = express();


// GET route
app.get("/user", (req, res) => {
  res.send({ firstname: "Kanan", lastname: "Panjwani" });
});

// POST route (save user)
app.post("/user", async (req, res) => {
  console.log(req.body);
  res.send("Data successfully saved to database!");
});

// DELETE route (delete by id)
app.delete("/user", async (req, res) => {
  res.send(`Data successfully deleted`);
});

// start server
app.listen(3000, () => {
  console.log("Server is listening");
});
