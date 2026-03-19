const Student = require("../models/Student");
const studentValidation = require("../middleware/student");

// Create Student
exports.createStudent = async (req, res, next) => {
  try {
    const { fullName, begenaId, batch, section, department, phoneNumber } = req.body;
    const { error } = studentValidation.validate(req.body);
    if (error) {
        const error = new Error("invalid input");
        error.statusCode = 400;
        throw error;
    }
    if (!fullName || !begenaId || !batch || !section || !department || !phoneNumber) {
        const error = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
    }


    const student = new Student({
      fullName,
      begenaId,
      batch,
      section,
      department,
      phoneNumber,
    });

    await student.save();
    res.status(201).json({ success: true, student });
  } 
  catch (error) {
    next(error);
  }
};

// Get All Students
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    if(!students){
      const error = new Error("students is not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, students });
  } 
  catch (error) {
    next(error);
  }
};

// Get Student By ID
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student){
      const error = new Error("student is not found");
      error.statusCode = 404;
      throw error;
    }   
     res.status(200).json({ success: true, student });
  } 
  catch (error) {
    next(error);
  }
};

// Update Student
exports.updateStudent = async (req, res, next) => {
  try {
    const { fullName, begenaId, batch, section, department, phoneNumber } = req.body;
    const { error } = studentValidation.validate(req.body);
    if (error) {
        const error = new Error("invalid input");
        error.statusCode = 400;
        throw error;
    }
    if(!fullName || !begenaId || !batch || !section || !department || !phoneNumber){
        const error = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
    }
      

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { fullName, begenaId, batch, section, department, phoneNumber },
      { new: true, runValidators: true }
    );

    if (!student){
      const error = new Error("student is not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, student });
  } 
  catch (error) {
    next(error);
  }
};

// Delete Student
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student){
        const error = new Error("student is not found");
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } 
  catch (error) {
    next(error);
  }
};
