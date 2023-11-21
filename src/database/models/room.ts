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
  host: {
    socketId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  participants: [
    {
      socketId: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      language: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
    },
  ],
});

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;
