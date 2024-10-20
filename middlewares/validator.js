import { check, validationResult } from "express-validator";
const validateUser = [
  check("name").trim().not().isEmpty().withMessage("Name is required!"),
  check("email").isEmail().withMessage("Email is invalid!"),
  check("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters long!")
    .not()
    .isEmpty()
    .withMessage("Password is required!"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req).array();
  if (!errors.length){
         return next();
  }
  res.status(400).json({ success:false, error:errors[0].msg });
  }
export { validate };
export default validateUser;
