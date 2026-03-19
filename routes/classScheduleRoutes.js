const express = require("express");
const router = express.Router();
const classScheduleController = require("../controllers/classScheduleController");
const autherizationRoles = require("../middleware/autherization");
const verificationToken = require("../middleware/authentication");

router.use(verificationToken);



// Create by admin
router.post("/", autherizationRoles("admin"), classScheduleController.createClassSchedule);

router.get("/", classScheduleController.getClassSchedules);
router.get("/:id", classScheduleController.getClassScheduleById);

// Update by admin
router.put("/:id", autherizationRoles("admin"), classScheduleController.updateClassSchedule);

// Delete by admin
router.delete("/:id", autherizationRoles("admin"), classScheduleController.deleteClassSchedule);

module.exports = router;
