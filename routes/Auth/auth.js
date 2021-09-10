const express = require("express");
const { check, validationResult } = require("express-validator");
const { signup,login,me } = require("../../controller/AuthController");


const router = express.Router();


const mailformat =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  //api/auth/signup Post
router.post(
  "/signup",
  [
    // chek name
    check("name")
      .isLength({ min: 3 })
      .withMessage("provide minimum length")
      .trim(),

    // email validation
    check("email")
      .isEmail()
      .matches(mailformat)
      .withMessage("invalid email adress")
      .normalizeEmail(),

    // password validator
    check("password")
      .isLength({ min: 8, max: 15 })
      .withMessage("your password have min max length between 8-15")
      .matches(/\d/)
      .withMessage("your password should have one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("your password should ahve at least one special character"),

    // confirm password
    check("confirmPasswrod").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("confirm password does not match");
      }
      return true;
    }),
  ],
  (req, res, next) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    if (!error.isEmpty()) return res.status(422).json({ error: error.array() });
    next();
  },
  signup
);

// api/auth/login
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .matches(mailformat)
      .withMessage("invalid email")
      .normalizeEmail(),
  ],
  (req, res, next) => {
    const someError = validationResult(req).formatWith(({ msg }) => msg);
    if (!someError.isEmpty())
      return res.status(422).json({ errors: someError.array() });

    next();
  },
  login
);

// /api/auth/me
router.get("/me", me);

module.exports = router;
