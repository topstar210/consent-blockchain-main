import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: String,
    userEmail: String,
    notifications: [],

    date: {
        type: Date,
        default: Date.now
    }
});

const notificationModel = mongoose.models['notification'] || mongoose.model('notification', notificationSchema);

export default notificationModel;