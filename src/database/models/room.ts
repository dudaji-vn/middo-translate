import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  languages: [
    {
      type: String,
      required: true,
    },
  ],
  participants: [
    {
      username: {
        type: String,
        required: true,
      },
      language: {
        type: String,
        required: true,
      },
    },
  ],
});

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;
