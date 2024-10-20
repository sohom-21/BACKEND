import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const verificationTokenSchema = new mongoose.Schema({
        owner:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
        },
        token:{
                type: String,
                required: true
        },
        createdAt:{
                type: Date,
                default: Date.now,
                expires: 3600
        }
});

verificationTokenSchema.pre('save', async function (next) {
        if (this.isModified('token')) {
                const hash = await bcrypt.hash(this.token, 10);
                this.token = hash;
        }
        next();
});

verificationTokenSchema.methods.compareToken = async function (token) {
        const result = await bcrypt.compare(token, this.token);
        return result;
}
export default mongoose.model('verificationToken', verificationTokenSchema)