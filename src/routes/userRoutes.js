const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController.js");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/register", userController.registration);
router.post("/login", userController.login);
router.get("/check", authMiddleware, userController.check);

module.exports = router;