import User from "../model/users.js";
import mails from "../Utils/mails.js";
import verify_token from "../model/verify_token.js";
import jwt from "jsonwebtoken";
const P = process.env.JWT_SECRET;
import { isValidObjectId } from "mongoose";

const {mailTransport, generateOtp, generateEmailTemplate, generateEmailTemplatePlain} = mails;
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }
        const newUser = new User({
            name,
            email,
            password,
        });

        const OTP = generateOtp();
        const verificationToken = new verify_token({
            owner: newUser._id,
            token: OTP
        })
        await verificationToken.save();
        await newUser.save();
        mailTransport().sendMail({
            from: 'emailverification@gmail.com',
            to: newUser.email,
            subject: "Verify your email account",
            html: generateEmailTemplate(OTP)
        })
        res.send(newUser);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send("Duplicate email error");
        } else {
            res.status(500).send("Internal server error");
        }
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).send("User not found");
        }

        const isMatch = await existingUser.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }

        const token = jwt.sign({ userId: existingUser._id }, P, {
            expiresIn: "1d",
        });
        res.send({ success: true, user: { name: existingUser.name, email: existingUser.email, id: existingUser._id, Token: token } });

    } catch (error) {
        res.status(500).send("Internal server error");
    }
};

const verifyemail = async (req, res) => {
    try {
        const {userId , otp} = req.body;
        if (!userId || !otp.trim()) {
            return res.status(400).send("Invalid request");
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send("Invalid user id");
        }
        
        const existingUser = await User.findById(userId);    
        if (!existingUser) {
            return res.status(400).send("!Sorry,User not found");
        }
        if (existingUser.verified) {
            return res.status(400).send("User already verified");
        }
        const token = await verify_token.findOne({ owner: existingUser._id });
        if (!token) {
            return res.status(400).send("Sorry, user assigned with this token not found!");
        }
        const isMatch = await token.compareToken(otp);
        if (!isMatch) {
            return res.status(400).send("please Provide correct OTP");
        } 
        existingUser.verified = true;
        await verify_token.findByIdAndDelete(token._id);
        await existingUser.save();
        mailTransport().sendMail({
            from: 'emailverification@gmail.com',
            to: existingUser.email,
            subject: "Verify your email account",
            html: generateEmailTemplatePlain()
        })
        res.send({ success: true, message : "User verified successfully", user: { name: existingUser.name, email: existingUser.email, id: existingUser._id, Token: token } });
    } catch (error) {
        res.status(500).send("Internal server error");
    }
};

export default { createUser, signin, verifyemail};