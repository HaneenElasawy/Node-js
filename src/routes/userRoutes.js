const router = require("express").Router();
const { register, login, listUsers, editUser, deleteUser } = require("../controllers/userController");
const { auth } = require("../middleware/auth");

router.post("/", register);
router.post("/login", login);

router.get("/", auth, listUsers);
router.patch("/:id", auth, editUser);
router.delete("/:id", auth, deleteUser);

module.exports = router;
