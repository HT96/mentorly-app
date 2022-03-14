const {Router} = require('express');
const {body} = require('express-validator');
const fieldController = require('../controllers/field.controller');

const router = Router();

// GET api/v1/fields get fields list
router.get('/', fieldController.index);

// GET api/v1/fields/:id get field
router.get('/:id', fieldController.show);

// POST api/v1/fields create field
router.post(
  '/',
  [
    body('title').trim().escape().not().isEmpty().withMessage('Field title is required')
      .isLength({max: 255}).withMessage('Field title cannot be longer than 255 characters')
  ],
  fieldController.create
);

module.exports = router;