const { body, validationResult } = require("express-validator");

const check = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

const validateSignup = [
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("username").notEmpty().withMessage("Username is required"),
  check,
];

const validateLogin = [
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  check,
];

const validateItem = [
  body("itemname").optional().notEmpty().withMessage("Item name is required"),
  check,
];

const validateClaimant = [
  body("claimantname").optional().notEmpty().withMessage("Name is required"),
  check,
];

const validateHelper = [
  body("helpername").optional().notEmpty().withMessage("Name is required"),
  check,
];

module.exports = { validateSignup, validateLogin, validateItem, validateClaimant, validateHelper };
