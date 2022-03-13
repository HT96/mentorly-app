const {Router} = require('express');
const {body} = require('express-validator');
const authController = require('../controllers/auth.controller');

const router = Router();

// api/v1/auth/signup
router.post(
  '/signup',
  [
    body('first_name').trim().escape().not().isEmpty().withMessage('First Name is required')
      .isLength({max: 255}).withMessage('First Name cannot be longer than 255 characters'),
    body('last_name').trim().escape().not().isEmpty().withMessage('Last Name is required')
      .isLength({max: 255}).withMessage('First Name cannot be longer than 255 characters'),
    body('email', 'Invalid Email').normalizeEmail().isEmail(),
    body('password', 'Invalid Password').isLength({min: 6})
  ],
  authController.signUp
);

// api/v1/auth/signin
router.post(
  '/signin',
  [
    body('email', 'Invalid Email').normalizeEmail().isEmail(),
    body('password', 'Password is required').not().isEmpty()
  ],
  authController.signIn
);

module.exports = router;