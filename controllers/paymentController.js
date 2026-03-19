const Payment = require("../models/Payment");
const paymentValidation = require("../middleware/payment");

// User creates a payment
exports.createPayment = async (req, res, next) => {
  try {
    const { fullName, section, screenshot, month, begenaId, batch } = req.body;
    const { error } = paymentValidation.validate(req.body);
        if (error) {
            const error = new Error("invalid input");
            error.statusCode = 400;
            throw error;
        }
        if (!fullName || !section || !screenshot || !month || !begenaId || !batch) {
            const error = new Error("All fields are required");
            error.statusCode = 400;
            throw error;
        }

    const payment = new Payment({
      fullName,
      section,
      screenshot,
      month,
      begenaId,
      batch
    });

    await payment.save();

    res.status(201).json({
      success: true,
      message: "Payment submitted successfully",
      payment
    });

  } 
  catch (error) {
    next(error);
  
    // 🔥 Handle duplicate month payment
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Payment for this month has already been submitted."
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
};

// Admin: Get all payments
exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    if(!payments){
      const error = new Error("payment is not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, payments });
  } 
  catch (error) {
    next(error);
  }
};

// Admin: Get a payment by ID
exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
        const error = new Error("payment is not found");
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({ success: true, payment });
  } 
  catch (error) {
    next(error);
  }
};

// Admin: Update payment
exports.updatePayment = async (req, res, next) => {
  try {
    const { fullName, section, screenshot, month, begenaId, batch } = req.body;
    const { error } = paymentValidation.validate(req.body);
    if (error) {
        const error = new Error("invalid input");
        error.statusCode = 400;
        throw error;
    }
    if(!fullName || !section || !screenshot || !month || !begenaId || !batch){
        const error = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { fullName, section, screenshot, month, begenaId, batch },
      { new: true, runValidators: true }
    );

    if (!payment) {
        const error = new Error("payment is not found");
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({ success: true, payment });
  } 
  catch (error) {
    next(error);
  }
};

// Admin: Delete payment
exports.deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
        const error = new Error("payment is not found");
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({ success: true, message: "Payment deleted successfully" });
  } catch (error) {
    next(error);
  }
};
