import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    required: [true, 'name is required'],
    type: String,
    trim: true,
  },
  email: {
    unique: true,
    required: [true, 'email is required'],
    type: String,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email must be a valid');
      }
    },
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minLength: 7,
    trim: true,
  },
});

userSchema.statics.findByCredentials = async (email, password) => {
  // eslint-disable-next-line no-use-before-define
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

// eslint-disable-next-line func-names
userSchema.methods.toJSON = function () {
  const { email, name } = this;
  return { email, name };
};

// eslint-disable-next-line func-names
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

export default User;
