const {Router} = require('express');
const {body} = require('express-validator');
const userController = require('../controllers/user.controller');

const router = Router();

// POST api/v1/users/fields attach field to user
router.post(
  '/fields',
  [
    body('field_id').not().isEmpty().withMessage('Field id is required')
  ],
  userController.attachField
);

// DELETE api/v1/users/fields/:id detach field from user
router.delete('/fields/:id', userController.detachField);

// GET api/v1/users get users list
router.get('/', userController.index);

// GET api/v1/users/:id get user
router.get('/:id', userController.show);

// PUT api/v1/users/:id update user
router.put(
  '/:id',
  [
    body('first_name').trim().escape().not().isEmpty().withMessage('First Name is required')
      .isLength({max: 255}).withMessage('First Name cannot be longer than 255 characters'),
    body('last_name').trim().escape().not().isEmpty().withMessage('Last Name is required')
      .isLength({max: 255}).withMessage('First Name cannot be longer than 255 characters'),
    body('position').trim().escape()
      .isLength({max: 255}).withMessage('First Name cannot be longer than 255 characters')
  ],
  userController.update
);

// DELETE api/v1/users/:id delete user
router.delete('/:id', userController.delete);

module.exports = router;