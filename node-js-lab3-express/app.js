const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const dataPath = path.join(__dirname, "inventory.json");

app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

function readInventory() {
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (err) {
    console.log("Read error:", err.message);
    return [];
  }
}

function writeInventory(items) {
  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));
}

function validateAmount(req, res, next) {
  const { amount } = req.body;
  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }
  next();
}

function validateCreateProduct(req, res, next) {
  const { name, quantity, category } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Invalid name" });
  }

  if (typeof quantity !== "number" || quantity < 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  if (category !== undefined && typeof category !== "string") {
    return res.status(400).json({ message: "Invalid category" });
  }

  next();
}

function validatePatchProduct(req, res, next) {
  const { name, quantity, category } = req.body;

  if (name !== undefined && typeof name !== "string") {
    return res.status(400).json({ message: "Invalid name" });
  }

  if (quantity !== undefined && (typeof quantity !== "number" || quantity < 0)) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  if (category !== undefined && typeof category !== "string") {
    return res.status(400).json({ message: "Invalid category" });
  }

  next();
}

app.get("/products", (req, res) => {
  const items = readInventory();
  res.status(200).json(items);
});

app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const items = readInventory();
  const product = items.find((p) => p.id === id);

  if (!product) return res.status(404).json({ message: "Product not found" });
  res.status(200).json(product);
});

app.post("/products", validateCreateProduct, (req, res) => {
  const items = readInventory();
  const maxId = items.reduce((m, p) => (p.id > m ? p.id : m), 0);

  const newProduct = {
    id: maxId + 1,
    name: req.body.name,
    quantity: req.body.quantity,
    category: req.body.category ?? "General",
  };

  items.push(newProduct);
  writeInventory(items);
  res.status(201).json(newProduct);
});

app.patch("/products/:id", validatePatchProduct, (req, res) => {
  const id = Number(req.params.id);
  const items = readInventory();
  const product = items.find((p) => p.id === id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  if (req.body.name !== undefined) product.name = req.body.name;
  if (req.body.quantity !== undefined) product.quantity = req.body.quantity;
  if (req.body.category !== undefined) product.category = req.body.category;

  writeInventory(items);
  res.status(200).json(product);
});

app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const items = readInventory();
  const index = items.findIndex((p) => p.id === id);

  if (index === -1) return res.status(404).json({ message: "Product not found" });

  const deleted = items.splice(index, 1)[0];
  writeInventory(items);
  res.status(200).json(deleted);
});

app.patch("/products/:id/restock", validateAmount, (req, res) => {
  const id = Number(req.params.id);
  const items = readInventory();
  const product = items.find((p) => p.id === id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  product.quantity += req.body.amount;
  writeInventory(items);
  res.status(200).json(product);
});

app.patch("/products/:id/destock", validateAmount, (req, res) => {
  const id = Number(req.params.id);
  const items = readInventory();
  const product = items.find((p) => p.id === id);

  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.quantity < req.body.amount) return res.status(400).json({ message: "Insufficient quantity" });

  product.quantity -= req.body.amount;
  writeInventory(items);
  res.status(200).json(product);
});

app.get("/", (req, res) => {
  const items = readInventory();
  res.status(200).render("index", { items });
});

app.listen(4000, () => {
  console.log("App is up and running on http://localhost:4000");
});
