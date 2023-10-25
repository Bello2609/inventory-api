const { Router }  = require("express");

const authRouter = require("./Auth/auth");
const productRouter = require("./Product/product")

const router = Router();

router.use("/auth", authRouter);
router.use("/product", productRouter);

router.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      route: "Routes",
      timestamp: Date.now(),
    });
  });

module.exports = router;