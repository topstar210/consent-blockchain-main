import notificationModel from "../../models/notificationModel";
import User from "../../models/saveUserToDbModel";
import { connectDb } from "../../utils/db";

const confirmConsent = async (req, res) => {
    await connectDb();
    if (req.method != "PATCH") return;
    const { from, consentTo, sendTo } = req.body;
    const { email } = await User.findOne({ walletAddress: from });
    const recipientAddress = await User.findOne({ walletAddress: sendTo }) || await User.findOne({ email: sendTo });
    const prefixOfEmail = email.split('@')[0];

    try {
        const isExist = await User.findOne({ walletAddress: sendTo }) || await User.findOne({ email: sendTo });
        if (!isExist) {
            res.status(400).json({ message: "Unregistred user" });
            return;
        }

        const newConsent = new requestConsent({
            from,
            consentTo,
            sendTo
        });
        await newConsent.save();
        const data = {
            title: "New consent request",
            description: `${prefixOfEmail} sent you a consent request`,
            consentId: "random Id",
            from: from,
            consent: consentTo,
            user: sendTo,
            date: Date.now()
        };
        const checkToRecepientAlreadyExist = await notificationModel.findOne({
            user: sendTo
        });

        if (checkToRecepientAlreadyExist) {
            const updateNotification = await notificationModel.updateOne({
                $push: {
                    notifications: data
                }
            });
            res.status(200).json({
                message: "New notification updated !!",
                newNotification: data
            });
            await disconnectDb();
            return;
        }

        const saveToNotificationCollection = await notificationModel.create({
            user: sendTo,
            userEmail: recipientAddress.email,
            notifications: [data]
        });
        res.status(200).json({
            message: "New Consent Created !!",
            newConsent: newConsent
        });
        await disconnectDb();
    } catch (error) {
        await disconnectDb();
        console.log(error);
    }
};

export default confirmConsent;