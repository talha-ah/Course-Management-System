const { clearFile } = require('../utils/clearFile');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const Teacher = require('../models/teacher');
const Course = require('../models/course');
const CourseLog = require('../models/nceac/courselog');
const CourseMonitoring = require('../models/nceac/coursemonitoring');
const CourseDescription = require('../models/nceac/coursedescription');
const Assignment = require('../models/materials/assignments');
const Quizz = require('../models/materials/quizzes');
const Paper = require('../models/materials/papers');

// =========================================================== Profile ================================================

exports.getTeacher = async (req, res, next) => {
  const teacherId = req.userId;

  try {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      const error = new Error('Unable to fetch the user.');
      error.status = 404;
      throw error;
    }

    // const totalCourses = teacher.courses.length;
    // var activeCourses = 0;
    // teacher.courses.map(course => {
    //   if (course.status === 'Active') {
    //     activeCourses++;
    //   }
    // });
    res.status(200).send({
      message: 'Teacher fetched.',
      teacher: {
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        dob: teacher.dob,
        address: teacher.address,
        phone: teacher.phone
      }
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.editProfile = async (req, res, next) => {
  const teacherId = req.userId;

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const dob = req.body.dob;
  const phone = req.body.phone;
  const address = req.body.address;
  const country = req.body.country;
  const city = req.body.city;
  const zip = req.body.zip;

  const errors = [];

  if (!validator.isAlphanumeric(firstName)) {
    errors.push('Invalid First Name!');
  }
  if (!validator.isAlphanumeric(lastName)) {
    errors.push('Invalid Last Name!');
  }
  if (!validator.isEmail(email)) {
    errors.push('Invalid Email!');
  }
  if (!validator.isNumeric(String(phone))) {
    errors.push('Invalid Phone!');
  }
  if (!validator.isAlphanumeric(address)) {
    errors.push('Invalid Address!');
  }
  if (!validator.isAlpha(Country)) {
    errors.push('Invalid Country!');
  }
  if (!validator.isAlpha(city)) {
    errors.push('Invalid City!');
  }
  if (!validator.isAlphanumeric(zip)) {
    errors.push('Invalid Zip!');
  }
  try {
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      const err = new Error('Could not find teacher.');
      err.status = 404;
      throw err;
    }

    // if (req.file) {
    //   var dpURL = req.file.path;
    //   dpURL = dpURL.replace(/\\/g, '/');
    //   if (dpURL !== teacher.dpURL) {
    //     clearFile(teacher.dpURL);
    //     teacher.dpURL = dpURL;
    //   }
    // }

    teacher.firstName = firstName;
    teacher.lastName = lastName;
    teacher.email = email;
    teacher.dob = dob;
    teacher.phone = phone;
    teacher.address.address = address;
    teacher.address.country = country;
    teacher.address.city = city;
    teacher.address.zip = zip;

    const updatedTeacher = await teacher.save();

    res.status(201).send({
      message: 'Profile Updated',
      teacher: {
        firstName: updatedTeacher.firstName,
        lastName: updatedTeacher.lastName,
        email: updatedTeacher.email,
        dob: updatedTeacher.dob,
        address: updatedTeacher.address,
        phone: updatedTeacher.phone,
        cvPath: updatedTeacher.cvUrl
      }
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(er);
  }
};

exports.editProfilePassword = async (req, res, next) => {
  const teacherId = req.userId;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  const errors = [];

  if (!validator.isLength(newPassword, { min: 6 })) {
    errors.push('Invalid New Password Length!');
  }
  try {
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      const err = new Error('Could not find teacher.');
      err.status = 404;
      throw err;
    }

    const passwordCheck = await bcrypt.compare(
      currentPassword,
      teacher.password
    );
    if (!passwordCheck) {
      var error = new Error('Wrong password!');
      error.status = 403;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    teacher.password = hashedPassword;

    const updatedTeacher = await teacher.save();

    res.status(201).json({
      message: 'Password updated!',
      teacher: {
        firstName: updatedTeacher.firstName,
        lastName: updatedTeacher.lastName,
        email: updatedTeacher.email,
        dob: updatedTeacher.dob,
        address: updatedTeacher.address,
        phone: updatedTeacher.phone,
        cvPath: updatedTeacher.cvUrl
      }
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.editCV = async (req, res, next) => {
  const teacherId = req.userId;

  try {
    if (req.file.mimetype !== 'application/pdf') {
      var error = new Error('File type not PDF!.');
      error.status = 400;
      throw error;
    }
    var cvPath = req.file.path;
    if (!cvPath || !req.file) {
      const err = new Error('No file provided!');
      err.status = 204;
      throw err;
    }
    cvPath = cvPath.replace(/\\/g, '/');
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      const err = new Error('Could not find teacher.');
      err.status = 404;
      throw err;
    }
    if (teacher.cvUrl !== 'undefined' || !teacher.cvUrl) {
      clearFile(teacher.cvUrl);
    }
    teacher.cvUrl = cvPath;
    const updatedTeacher = await teacher.save();
    res.status(201).json({
      message: 'CV Updated!',
      teacher: {
        firstName: updatedTeacher.firstName,
        lastName: updatedTeacher.lastName,
        email: updatedTeacher.email,
        dob: updatedTeacher.dob,
        address: updatedTeacher.address,
        phone: updatedTeacher.phone,
        cvPath: updatedTeacher.cvUrl
      }
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

// =========================================================== Courses ================================================

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().select('title');
    // const courses = await Course.find({ status: 'Active' }).select(
    //   'title -_id'
    // );
    // OR .find({}).select({ "name": 1, "_id": 0});

    if (!courses) {
      var error = new Error('Unable to fetch the courses');
      error.status = 400;
      throw error;
    }

    res.status(200).json({ message: 'Courses fetched!', courses: courses });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getTeacherCourses = async (req, res, next) => {
  const teacherId = req.userId;

  try {
    const teacher = await Teacher.findById(teacherId)
      .populate('coursesAssigned.courseId')
      .exec();

    if (!teacher) {
      const error = new Error('Error in fetching the teacher!');
      error.code = 404;
      throw new error();
    }

    var courses = teacher.coursesAssigned;

    var totalCourses = 0;
    if (courses) {
      totalCourses = courses.length;
    }

    var updatedCourses = [];

    courses.map(course => {
      updatedCourses.push({
        _id: course.courseId._id,
        title: course.courseId.title,
        code: course.courseId.code,
        credits: course.courseId.credits,
        type: course.courseId.type,
        sessionType: course.courseId.session,
        status: course.status,
        sections: course.sections,
        session: course.session
      });
    });

    res.status(200).json({
      message: 'Courses fetched!',
      courses: updatedCourses,
      totalCourses: totalCourses
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.takeCourse = async (req, res, next) => {
  const teacherId = req.userId;

  const courseId = req.body.courseId;
  const sections = req.body.sections;
  const session = req.body.session;

  try {
    const course = await Teacher.find({
      _id: teacherId,
      'coursesAssigned.courseId': courseId
    });

    if (course.length > 0) {
      const error = new Error('Course already exists!');
      error.status = 400;
      throw error;
    }

    const courseLog = new CourseLog({
      courseId: courseId,
      teacherId: teacherId
    });
    const courseMonitoring = new CourseMonitoring({
      courseId: courseId,
      teacherId: teacherId
    });
    const courseDescription = new CourseDescription({
      courseId: courseId,
      teacherId: teacherId
    });

    const courseLogDoc = await courseLog.save();
    const courseDescriptionDoc = await courseDescription.save();
    const courseMonitoringDoc = await courseMonitoring.save();

    const assignment = new Assignment({
      courseId: courseId,
      teacherId: teacherId
    });
    const quiz = new Quizz({
      courseId: courseId,
      teacherId: teacherId
    });
    const paper = new Paper({
      courseId: courseId,
      teacherId: teacherId
    });

    const assignmentDoc = await assignment.save();
    const quizDoc = await quiz.save();
    const paperDoc = await paper.save();

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      const error = new Error('Error in fetching the teacher!');
      error.code = 404;
      throw error;
    }

    teacher.coursesAssigned.push({
      courseId: courseId,
      sections: sections,
      session: session,
      status: 'Active',
      courseLog: courseLogDoc._id,
      courseDescription: courseDescriptionDoc._id,
      courseMonitoring: courseMonitoringDoc._id,
      assignments: assignmentDoc._id,
      quizzes: quizDoc._id,
      papers: paperDoc._id
    });
    const teacherData = await teacher.save();

    if (!teacherData) {
      const error = new Error('Error in saving the teacher!');
      error.code = 404;
      throw new error();
    }
    res.status(201).json({ message: 'Course added!', teacher: teacherData });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.removeCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  // delete course places

  Teacher.findByIdAndUpdate(
    teacherId,
    {
      $pull: { courses: { courseId: courseId } }
    },
    { new: true }
  )
    .then(teacher => {
      if (!teacher) {
        const error = new Error('Error in removing course from the teacher!');
        error.code = 404;
        throw new error();
      }
      res.send({ teacher: teacher, courseName: courseName });
    })
    .catch(err => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

// =========================================================== NCEAC Forms ================================================

exports.addCourseLog = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  const date = req.body.date;
  const duration = req.body.duration;
  const topics = req.body.topics;
  const instruments = req.body.instruments;
  try {
    const courseLog = await CourseLog.findOne({
      teacherId: teacherId,
      courseId: courseId
    });

    if (!courseLog) {
      const error = new Error('Error in fetching course log!');
      error.code = 404;
      throw new error();
    }

    courseLog.log.push({
      date: date,
      duration: duration,
      topics: topics,
      instruments: instruments
    });

    const courseLogDoc = await courseLog.save();

    res.send({ courseLog: courseLogDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addCourseMonitoring = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  const howFar = req.body.howFar;
  const fullCover = req.body.fullCover;
  const relevantProblems = req.body.relevantProblems;
  const assessStandard = req.body.assessStandard;
  const emergeApplication = req.body.emergeApplication;
  try {
    const courseMonitoring = await CourseMonitoring.findOne({
      teacherId: teacherId,
      courseId: courseId
    });

    courseMonitoring.data.howFar = howFar;
    courseMonitoring.data.fullCover = fullCover;
    courseMonitoring.data.relevantProblems = relevantProblems;
    courseMonitoring.data.assessStandard = assessStandard;
    courseMonitoring.data.emergeApplication = emergeApplication;

    const courseMonitoringDoc = await courseMonitoring.save();

    res.send({ courseMonitoring: courseMonitoringDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addCourseDescription = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  const prerequisites = req.body.prerequisites;
  const assignments = req.body.assignments; //
  const quizzes = req.body.quizzes; //
  const mid = req.body.mid; //
  const final = req.body.final; //
  const courseCoordinator = req.body.courseCoordinator;
  const url = req.body.url;
  const currentCatalogue = req.body.currentCatalogue;
  const textBook = req.body.textBook;
  const referenceMaterial = req.body.referenceMaterial;
  const courseGoals = req.body.courseGoals;
  const topicsCovered = req.body.topicsCovered;
  const labProjects = req.body.labProjects;
  const progAssignments = req.body.progAssignments;
  const theory = req.body.theory; //
  const problemAnalysis = req.body.problemAnalysis; //
  const solutionDesign = req.body.solutionDesign; //
  const socialAndEthicalIssues = req.body.socialAndEthicalIssues; //
  const oralAndWritten = req.body.oralAndWritten;

  try {
    const courseDescription = await CourseDescription.findOne({
      teacherId: teacherId,
      courseId: courseId
    });

    courseDescription.data.prerequisites = prerequisites;
    courseDescription.data.assessmentInstruments.assignments = assignments;
    courseDescription.data.assessmentInstruments.quizzes = quizzes;
    courseDescription.data.assessmentInstruments.mid = mid;
    courseDescription.data.assessmentInstruments.final = final;
    courseDescription.data.courseCoordinator = courseCoordinator;
    courseDescription.data.url = url;
    courseDescription.data.currentCatalogue = currentCatalogue;
    courseDescription.data.textBook = textBook;
    courseDescription.data.referenceMaterial.push(referenceMaterial);
    courseDescription.data.courseGoals = courseGoals;
    courseDescription.data.topicsCovered = topicsCovered;
    courseDescription.data.labProjects = labProjects;
    courseDescription.data.progAssignments = progAssignments;
    courseDescription.data.classTimeSpent.theory = theory;
    courseDescription.data.classTimeSpent.problemAnalysis = problemAnalysis;
    courseDescription.data.classTimeSpent.solutionDesign = solutionDesign;
    courseDescription.data.classTimeSpent.socialAndEthicalIssues = socialAndEthicalIssues;
    courseDescription.data.oralAndWritten = oralAndWritten;

    const courseDescriptionDoc = await courseDescription.save();

    res.send({ CourseDescription: courseDescriptionDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

// =========================================================== Materials ==================================================

exports.addAssignment = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  const questionFilePath = req.body.questionFilePath;
  const solutionFilePath = req.body.solutionFilePath;
  const weightage = req.body.weightage;
  const time = req.body.time;

  try {
    const assignment = await Assignment.findOne({
      teacherId: teacherId,
      courseId: courseId
    });

    assignment.assignments.push({
      questionFilePath: questionFilePath,
      solutionFilePath: solutionFilePath,
      weightage: weightage,
      time: time
    });

    const assignmentDoc = await assignment.save();

    res.send({ assignments: assignmentDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addQuiz = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  const questionFilePath = req.body.questionFilePath;
  const solutionFilePath = req.body.solutionFilePath;
  const weightage = req.body.weightage;
  const time = req.body.time;

  try {
    const quiz = await Quizz.findOne({
      teacherId: teacherId,
      courseId: courseId
    });

    quiz.quizzes.push({
      questionFilePath: questionFilePath,
      solutionFilePath: solutionFilePath,
      weightage: weightage,
      time: time
    });

    const quizDoc = await quiz.save();

    res.send({ quizzes: quizDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addPaper = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  const questionFilePath = req.body.questionFilePath;
  const solutionFilePath = req.body.solutionFilePath;
  const weightage = req.body.weightage;
  const time = req.body.time;

  try {
    const paper = await Paper.findOne({
      teacherId: teacherId,
      courseId: courseId
    });

    paper.papers.push({
      questionFilePath: questionFilePath,
      solutionFilePath: solutionFilePath,
      weightage: weightage,
      time: time
    });

    const paperDoc = await paper.save();

    res.send({ papers: paperDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
