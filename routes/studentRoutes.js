const express = require("express");
const studentController = require("../controllers/studentController.js");
const autherizationRoles = require("../middleware/autherization.js");
const verificationToken = require("../middleware/authentication.js");
const router = express.Router();
router.use(verificationToken);
router.post("/", autherizationRoles("admin"), studentController.createStudent);
router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.put("/:id", autherizationRoles("admin"), studentController.updateStudent);
router.delete("/:id", autherizationRoles("admin"), studentController.deleteStudent);

module.exports = router;
