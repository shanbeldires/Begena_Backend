const Section = require("../models/Section");
const sectionValidation = require("../middleware/section");

// Create Section
exports.createSection = async (req, res, next) => {
  try {
    const { section, assignedTeacher, classDate, classTime } = req.body;
    const { error } = sectionValidation.validate(req.body);
    if (error) {
      const error = new Error("invalid input");
      error.statusCode = 400;
      throw error;
    }
    if (!section || !assignedTeacher || !classDate || !classTime) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    const newSection = new Section({
      section,
      assignedTeacher,
      classDate,
      classTime,
    });

    await newSection.save();
    res.status(201).json({ success: true, section: newSection });
  } 
  catch (error) {
    next(error);
  }
};

// Get All Sections
exports.getAllSections = async (req, res, next) => {
  try {
    const sections = await Section.find().sort({ createdAt: -1 });
      if(!sections){
        const error = new Error("sections is not found");
        error.statusCode = 404;
        throw error;
      }
    res.status(200).json({ success: true, sections });
  } 
  catch (error) {
    next(error);
  }
};

// Get Section By ID
exports.getSectionById = async (req, res, next) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section){
      const error = new Error("section is not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, section });
  } 
  catch (error) {
    next(error);
  }
};

// Update Section
exports.updateSection = async (req, res) => {
  try {
    const { section, assignedTeacher, classDate, classTime } = req.body;
    const { error } = sectionValidation.validate(req.body);
    if (error) {
        const error = new Error("invalid input");
        error.statusCode = 400;
        throw error;
    }
    if (!section || !assignedTeacher || !classDate || !classTime){
        const error = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
    }

    const updatedSection = await Section.findByIdAndUpdate(
      req.params.id,
      { section, assignedTeacher, classDate, classTime },
      { new: true, runValidators: true }
    );

    if (!updatedSection)
      return res.status(404).json({ success: false, message: "Section not found" });

    res.status(200).json({ success: true, section: updatedSection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Section
exports.deleteSection = async (req, res, next) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);

    if (!section){
        const error = new Error("section is not found");
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({ success: true, message: "Section deleted successfully" });
  } 
  catch (error) {
    next(error);
  }
};
