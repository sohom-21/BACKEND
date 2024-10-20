import express from "express";
import control from "../controllers/control.js";
import validateUser, { validate } from "../middlewares/validator.js";
    
const {createUser} = control;
const {signin} = control;
const {verifyemail}= control;


const router = express.Router();

router.post('/create',validateUser,validate,createUser);
router.post('/signin',signin);
router.post('/verify-email',verifyemail);
export default router