const {validationResult} = require('express-validator');
const Field = require('../models/field.model');

module.exports.index = async (req, res) => {
  try {
    const fields = await Field.findByQuery(req.query);
    return res.status(200)
      .json(fields);
  } catch (e) {
    console.error(e);
    return res.status(500)
      .json({
        msg: 'Server Error'
      });
  }
};

module.exports.show = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    if ( !field) {
      return res.status(404)
        .json({
          msg: 'Professional field not found'
        });
    }

    return res.status(200)
      .json(field);
  } catch (e) {
    console.error(e);
    return res.status(500)
      .json({
        msg: 'Server Error'
      });
  }
};

module.exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if ( !errors.isEmpty()) {
      return res.status(400)
        .json({
          errors: errors.array()
        });
    }

    const title = req.body.title;
    const fieldExists = await Field.exists(title);
    if (fieldExists) {
      return res.status(400)
        .json({
          msg: 'Professional field with this title already exists'
        });
    }

    const field = await Field.create(title);

    return res.status(200)
      .json({
        field: field,
        msg: 'Professional field successfully created'
      });
  } catch (e) {
    console.error(e);
    return res.status(500)
      .json({
        msg: 'Server Error'
      });
  }
};