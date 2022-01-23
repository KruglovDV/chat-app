import express from 'express';
import auth from '../auth.js';

const router = new express.Router();

router.get('/', auth, (req, res) => {
  res.render('templates/index');
});

export default router;
