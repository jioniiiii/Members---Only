const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');

//sign-up(GET)
exports.signUpGet = (req, res) => {
  res.render('sign-up', { errors: [] });
};

//sign-up(POST)
exports.signUpPost = [
  //validation checks
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one digit.'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
  body('username')
    .custom(async (value) => {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [value]);
      if (result.rows.length > 0) {
        throw new Error('Username is already in use.');
      }
      return true;
    }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('sign-up', { errors: errors.array() });
    }

    //hash and store the password
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await pool.query('INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)', [
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        hashedPassword,
      ]);
      res.redirect('/');
    } catch (err) {
      return next(err);
    }
  }
];

exports.logInPost = passport.authenticate('local', {
  successRedirect: 'msg-board',
  failureRedirect: '/'
});

exports.logOutGet = (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};