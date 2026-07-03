const mongoose=require('mongoose')

const membershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'member'],
      default: 'member',
    },
  },
  { timestamps: true }
);

membershipSchema.index({ user: 1, workspace: 1 }, { unique: true });
module.exports = mongoose.model('Membership', membershipSchema);