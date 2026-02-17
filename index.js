require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "API running" }));

app.use("/users", userRoutes);
app.use("/products", productRoutes);

app.use(errorHandler);

connectDB().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
