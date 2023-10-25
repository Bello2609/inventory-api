const { Router } = require("express");
const { authorize } = require("../../middleware/authorizeCustomer");
const { 
   createProduct,
   deleteProduct,
   getProduct,
   editProduct,
   getEachProduct
   } = require("../../controller/Product/product");
   
const router = Router();

router.post("/createProduct", authorize, createProduct);
router.get("/allProduct", authorize, getProduct);
router.delete("/deleteProduct/:productId", authorize, deleteProduct);
router.patch("/editProduct/:productId", authorize, editProduct);
router.post("/singleProduct/:productId", authorize, getEachProduct);
router.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      route: "Auth Route",
      timestamp: Date.now(),
    });
  });
module.exports = router;