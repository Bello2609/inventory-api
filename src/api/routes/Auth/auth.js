const { Router } = require("express");

const { register, login } = require("../../controller/Auth/auth");

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      route: "Auth Route",
      timestamp: Date.now(),
    });
  });

module.exports = router;