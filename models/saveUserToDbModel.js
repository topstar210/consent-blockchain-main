import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: String,
    walletAddress: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;