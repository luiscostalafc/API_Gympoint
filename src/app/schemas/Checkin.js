import mongoose from 'mongoose';

const CheckinSchema = new mongoose.Schema(
  {
    students_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

export default mongoose.model('Checkin', CheckinSchema);
