import express from 'express';
import auth from '../auth.js';

export const router = new express.Router();

router.get('/', auth, (req, res) => {
  res.render('templates/index');
});