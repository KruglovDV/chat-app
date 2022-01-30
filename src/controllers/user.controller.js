import express from 'express';
// import multer from 'multer';
// import sharp from 'sharp';

import User from '../models/user.js';

const router = new express.Router();

router.get('/signup', (req, res) => {
  res.render('templates/signup');
});

router.post('/signup', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.redirect('/login');
  } catch (error) {
    const errors = error?.errors ?? {};
    if (error.code === 11000) {
      errors.email = { message: 'email already exists' };
    }
    res.status(422);

    res.render('templates/signup', { errors, ...req.body, values: req.body });
  }
});

router.get('/login', (req, res) => {
  res.render('templates/login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    req.session.userId = user._id;
    res.redirect('/');
  } catch (error) {
    res.status(422);
    res.render(
      'templates/login',
      { error: 'invalid credentials', values: req.body },
    );
  }
});

router.get('/logout', (req, res) => {
  res.render('templates/logout');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

export default router;
