import mongoose from 'mongoose';

const messageModel = mongoose.model('Message', {
  user: String,
  message: String,
});

export default messageModel;
