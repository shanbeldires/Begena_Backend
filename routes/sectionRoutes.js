const express = require("express");
const sectionController = require("../controllers/sectionController");
const autherizationRoles = require("../middleware/autherization");
const verificationToken = require("../middleware/authentication");
const router = express.Router();
router.use(verificationToken);
router.use(autherizationRoles("admin"))
router.post("/", sectionController.createSection);
router.get("/",  sectionController.getAllSections);
router.get("/:id", sectionController.getSectionById);
router.put("/:id", sectionController.updateSection);
router.delete("/:id", sectionController.deleteSection);

module.exports = router;
