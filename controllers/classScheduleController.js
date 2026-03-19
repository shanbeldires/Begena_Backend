const ClassSchedule = require("../models/ClassSchedule");
const classScheduleVaidation = require("../middleware/classSchedule");


// ✅ Create a new class schedule
exports.createClassSchedule = async (req, res, next) => {
    try {
        const { type, section, date, time } = req.body;
        const { error } = classScheduleVaidation.validate(req.body);
        if (error) {
            const error = new Error("invalid input");
            error.statusCode = 400;
            throw error;
        }
        if (!type || !section || !date || !time) {
            const error = new Error("All fields are required");
            error.statusCode = 400;
            throw error;
        }


        const schedule = await ClassSchedule.create({ type, section, date, time });

        res.status(201).json({
            success: true,
            message: "Class schedule created successfully",
            schedule
        });
    } catch (error) {
        next(error);
}
};

// ✅ Get all class schedules (for users)
exports.getClassSchedules = async (req, res, next) => {
    try {
        const schedules = await ClassSchedule.find().sort({ date: 1, time: 1 });
        if (!schedules){
            const error = new Error("schedule is not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, schedules });
    }
     catch (error) {
        next(error);
    }
};

// ✅ Get single schedule by ID
exports.getClassScheduleById = async (req, res) => {
    try {
        const schedule = await ClassSchedule.findById(req.params.id);
        if (!schedule) {
             const error = new Error("schedule is not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, schedule });
    } 
    catch (error) {
    next(error);
    }
};

// ✅ Update class schedule by ID
exports.updateClassSchedule = async (req, res, next) => {
    try {
        const { type, section, date, time } = req.body;
        const { error } = classScheduleVaidation.validate(req.body);
        if (error) {
           const error = new Error("invalid input");
            error.statusCode = 400;
            throw error;
        }
        if (!type || !section || !date || !time) {
            const error = new Error("All fields are required");
            error.statusCode = 400;
            throw error;

        }

        const schedule = await ClassSchedule.findByIdAndUpdate(
            req.params.id,
            { type, section, date, time },
            { new: true, runValidators: true }
        );

        if (!schedule) {
            const error = new Error("schedule is not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "Class schedule updated successfully",
            schedule
        });
    } 
    catch (error) {
    next(error);
    }
};

// ✅ Delete class schedule by ID
exports.deleteClassSchedule = async (req, res, next) => {
    try {
        const schedule = await ClassSchedule.findByIdAndDelete(req.params.id);

        if (!schedule) {
            const error = new Error("schedule is not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, message: "Class schedule deleted successfully" });
    } 
    catch (error) {
    next(error);
    }
};
