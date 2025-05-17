import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
export const registerValidationRules = [
  body("email")
    .isEmail()
    .withMessage("Email must be a valid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please add the password confirmation")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  body("name")
    .isLength({ min: 3 })
    .withMessage("Name is required"),

  body("province")
    .notEmpty()
    .withMessage("Province is required"),

  body("district")
    .notEmpty()
    .withMessage("District is required"),

  body("sector")
    .notEmpty()
    .withMessage("Sector is required"),

  body("cell")
    .notEmpty()
    .withMessage("Cell is required"),

  body("village")
    .notEmpty()
    .withMessage("Village is required"),
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
