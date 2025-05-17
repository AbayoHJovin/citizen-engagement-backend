import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const registerValidationRules = [
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please add the password confirmation"),
  body("name").isLength({ min: 3 }).withMessage("Name is required"),
];

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      msg: err.msg,
    }));

    res.status(400).json({ errors: formattedErrors });
    return;
  }
  next();
};
