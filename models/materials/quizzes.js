const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const quizzes = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  grades: { type: Object, default: {}, required: true },
  quizzes: [
    {
      title: { type: String },
      marks: { type: String },
      batch: '',
      section: '',
      assessment: { type: String },
      quiz: {
        name: { type: String },
        path: { type: String },
      },
      solution: {
        name: { type: String },
        path: { type: String },
      },
      result: { type: Object },
    },
  ],
});

module.exports = mongoose.model('Quizzes', quizzes);
