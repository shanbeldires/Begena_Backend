const announcementValidation = require("../middleware/announcement");
const Announcement = require("../models/Announcement");

// Create a new announcement
exports.createAnnouncement = async (req, res, next) => {
    try {
        const { title, body, date, time } = req.body;
        const { error } = announcementValidation.validate(req.body);

        if (error) {
            const error = new Error("invalid input");
            error.statusCode = 400;
            throw error;
        }
        if (!title || !body || !date || !time) {
            const error = new Error("All fields are required");
            error.statusCode = 400;
            throw error;
        }
        const announcement = new Announcement({ title, body, date, time });
        await announcement.save();
        res.status(201).json({ success: true, announcement });
    } catch (error) {
        next(error);
    }
};

// Get all announcements
exports.getAnnouncements = async (req, res,next) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        if(!announcements){
            const error = new Error("announcemet is not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, announcements });
    } catch (error) {
      next(error)
    }
};

// Get a single announcement by ID
exports.getAnnouncementById = async (req, res,next) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            const error = new Error("announcemet is not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, announcement });
    } catch (error) {
        next(error)
    }
};

// Update an announcement by ID
exports.updateAnnouncement = async (req, res, next) => {
    try {
        const { title, body, date, time } = req.body;
        const {error} = announcementValidation.validate(req.body)
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            { title, body, date, time },
            { new: true, runValidators: true }
        );
        if (!announcement) {
            const error = new Error("announcemet is not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
        success: true,
        message: "Announcement updated successfully",
        announcement
        });

    } 
    catch (error) {
       next(error)
    }
};

// Delete an announcement by ID
exports.deleteAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        if (!announcement) {
            const error = new Error("announcemet is not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, message: "Announcement deleted successfully" });
    } 
    catch (error) {
       next(error);
    }
}
