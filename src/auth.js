import User from './models/user.js';

const auth = (req, res, next) => {
  if (!req.session?.userId) {
    return res.redirect('/login');
  }

  req.user = User.findById(req.session?.userId);
  next();
};

export default auth;