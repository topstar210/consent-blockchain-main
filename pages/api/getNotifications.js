
import notificationModel from "../../models/notificationModel";
import { connectDb } from "../../utils/db";

const getNotifications = async (req, res) => {
    await connectDb();
    if (req.method != "GET") return;
    const { user } = req.query;
    try {
        const notifications = await notificationModel.findOne({ user: user });
        if (!notifications) {
            res.status(200).json({ message: "No notifications found" });
            return;
        }
        res.status(200).json({ notifications: notifications.notifications });
        return;
    }
    catch (error) {
        console.log(error);
    }
}

export default getNotifications;