const router = require("express").Router();
const {
  createProduct,
  editProduct,
  changeStock,
  deleteProduct,
  listProducts
} = require("../controllers/productController");
const { auth } = require("../middleware/auth");

router.use(auth);

router.post("/", createProduct);
router.get("/", listProducts);

router.patch("/:id", editProduct);
router.patch("/:id/stock", changeStock);
router.delete("/:id", deleteProduct);

module.exports = router;
