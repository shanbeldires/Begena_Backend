const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const autherizationRoles = require("../middleware/autherization");
const verificationToken = require("../middleware/authentication");

router.use(verificationToken);


// User creates a payment
router.post("/", paymentController.createPayment);

// Admin routes
router.get("/", autherizationRoles("admin"), paymentController.getAllPayments);
router.get("/:id", autherizationRoles("admin"), paymentController.getPaymentById);
router.put("/:id", autherizationRoles("admin"), paymentController.updatePayment);
router.delete("/:id", autherizationRoles("admin"), paymentController.deletePayment);

module.exports = router;
