import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    unique: true,
    required: true,
    type: String,
    trim: true,
    lowercase: true,
  },
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
