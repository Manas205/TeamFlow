const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true }, // denormalized, explained below
    position: { type: Number, required: true },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Card', cardSchema);