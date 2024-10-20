import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
        name: {
                type: String,
                required: true
        },
        email: {
                type: String,
                required: true,
                unique: true
        },
        password: {
                type: String,
                required: true,
                minlength: 6,
                maxlength: 20
        },
        date: {
                type: Date,
                default: Date.now
        },
        verified: {
                type: Boolean,
                default: false,
                required: true
        }
});

userSchema.pre('save', async function (next) {
        if (this.isModified('password')) {
                const hash = await bcrypt.hash(this.password, 10);
                this.password = hash;
        }
        next();
});

userSchema.methods.comparePassword = async function (password) {
        const result = await bcrypt.compare(password, this.password);
        return result;
}
export default mongoose.model('User', userSchema)