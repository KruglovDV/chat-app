import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: {
    required: true,
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Room',
  },
});

messageSchema.set('timestamps', true);

const Message = mongoose.model('Message', messageSchema);

export default Message;
