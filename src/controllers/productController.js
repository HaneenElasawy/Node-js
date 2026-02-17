const Product = require("../models/Product");
const { getStatus } = require("../utils/productStatus");

// helper: check owner or admin
function canAccessProduct(reqUser, product) {
  if (reqUser.role === "admin") return true;
  return product.owner.toString() === reqUser._id.toString();
}

async function createProduct(req, res, next) {
  try {
    const { name, categories, quantity } = req.body;

    const product = await Product.create({
      owner: req.user._id,
      name,
      categories: categories && categories.length ? categories : undefined,
      quantity
    });

    res.status(201).json({
      ...product.toObject(),
      status: getStatus(product.quantity)
    });
  } catch (err) {
    next(err);
  }
}

async function editProduct(req, res, next) {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!canAccessProduct(req.user, product)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const allowed = ["name", "categories", "quantity"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) product[key] = req.body[key];
    }

    await product.save();

    res.json({ ...product.toObject(), status: getStatus(product.quantity) });
  } catch (err) {
    next(err);
  }
}

async function changeStock(req, res, next) {
  try {
    const { id } = req.params;
    const { operation, quantity } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!canAccessProduct(req.user, product)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!["restock", "destock"].includes(operation)) {
      return res.status(400).json({ message: "operation must be restock or destock" });
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ message: "quantity must be a positive number" });
    }

    if (operation === "restock") product.quantity += quantity;
    if (operation === "destock") product.quantity = Math.max(0, product.quantity - quantity);

    await product.save();

    res.json({ ...product.toObject(), status: getStatus(product.quantity) });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!canAccessProduct(req.user, product)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: "product deleted successfully" });
  } catch (err) {
    next(err);
  }
}

// GET /users/:userId/products -> products of specific user
async function getUserProducts(req, res, next) {
  try {
    const { userId } = req.params;

    // ACL: user can view only his products unless admin
    const isOwner = req.user._id.toString() === userId;
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const products = await Product.find({ owner: userId }).lean();
    const withStatus = products.map((p) => ({ ...p, status: getStatus(p.quantity) }));
    res.json(withStatus);
  } catch (err) {
    next(err);
  }
}

// GET /products?limit=10&skip=0&status=available
async function listProducts(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit || 10), 50);
    const skip = Number(req.query.skip || 0);
    const statusFilter = req.query.status;

    // show only your products unless admin (simple interpretation)
    const filter = req.user.role === "admin" ? {} : { owner: req.user._id };

    let products = await Product.find(filter).skip(skip).limit(limit).lean();

    products = products.map((p) => ({ ...p, status: getStatus(p.quantity) }));

    if (statusFilter) {
      products = products.filter((p) => p.status === statusFilter);
    }

    res.json(products);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProduct,
  editProduct,
  changeStock,
  deleteProduct,
  getUserProducts,
  listProducts
};
