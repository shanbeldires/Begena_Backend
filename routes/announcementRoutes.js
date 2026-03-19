const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");
const autherizationRoles = require("../middleware/autherization");
const verificationToken = require("../middleware/authentication");

router.use(verificationToken);


// Create a new announcement (only admin)
router.post("/", autherizationRoles("admin"), announcementController.createAnnouncement);

// Get all announcements
router.get("/", announcementController.getAnnouncements);

// Get a single announcement by ID
router.get("/:id", announcementController.getAnnouncementById);

// Update an announcement by ID (only admin)
router.put("/:id", autherizationRoles("admin"), announcementController.updateAnnouncement);

// Delete an announcement by ID (only admin)
router.delete("/:id", autherizationRoles("admin"), announcementController.deleteAnnouncement);

module.exports = router;