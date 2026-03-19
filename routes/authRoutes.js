const express = require("express");
const { signUp, signIn, signOut, refreshToken, getUser } = require("../controllers/authController");
const autherizationRoles = require("../middleware/autherization");
const verificationToken = require("../middleware/authentication");
const router = express.Router();

router.post("/register", signUp);
router.post("/login", signIn);
router.post("/logout",verificationToken, signOut);
router.post("/refresh", refreshToken);
router.get("/getuser",verificationToken,autherizationRoles("admin"), getUser)

module.exports = router;
