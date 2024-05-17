import notificationModel from "../../models/notificationModel";
import requestConsentModel from "../../models/requestConsentModel";
import User from "../../models/saveUserToDbModel";
import { connectDb, disconnectDb } from "../../utils/db";

const requestConsentApi = async (req, res) => {
    await connectDb();
    const { from, consentTo, sendTo, consentId } = req.body;
    if (from === sendTo) {
        res.status(400).json({ message: "You can't send consent request to yourself" });
        return;
    }
    const { email } = await User.findOne({ walletAddress: from });
    const recipientAddress = await User.findOne({ walletAddress: sendTo }) || await User.findOne({ email: sendTo })
    const prefixOfEmail = email.split('@')[0];

    try {
        const isExist = await User.findOne({ walletAddress: sendTo }) || await User.findOne({ email: sendTo });
        if (!isExist) {
            res.status(400).json({ message: "Unregistred user" })
            return;
        }

        const newConsent = new requestConsentModel({ from, consentTo, sendTo });
        await newConsent.save();

        const data = {
            title: "New consent request",
            description: `${prefixOfEmail} sent you a consent request`,
            consentId: consentId,
            from: from,
            consent: consentTo,
            user: sendTo,
            date: Date.now()
        }

        const checkToRecepientAlreadyExist = await notificationModel.findOne({ user: sendTo });
        if (checkToRecepientAlreadyExist) {
            const updateNotification = await notificationModel.updateOne(
                { $push: { notifications: data } }
            );

            res.status(200).json({ message: "New notification updated !!", newNotification: data });
            // await disconnectDb();
            return;
        };

        const saveToNotificationCollection = await notificationModel.create({ user: sendTo, userEmail: recipientAddress.email, notifications: [data] });

        res.status(200).json({ message: "New Consent Created !!", newConsent: newConsent });
        // await disconnectDb();
    } catch (error) {
        // await disconnectDb();
        console.log(error)
    }
}

export default requestConsentApi;