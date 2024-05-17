import User from "../../models/saveUserToDbModel";
import { connectDb, disconnectDb } from "../../utils/db";

/**
 * Saves a user to the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is saved to the database.
 */
const saveUserToDb = async (req, res) => {
    await connectDb();
    if (req.method != "POST") return;
    const checkUserExist = await User.findOne({
        email: req.body.email,
        walletAddress: req.body.walletAddress,
    });

    if (checkUserExist) {
        res.status(400).json({ message: "User already exists" });
        await disconnectDb();
        return;
    }

    const { email, walletAddress } = req.body;
    const user = new User({ email, walletAddress });
    try {
        await user.save();
        return res.status(200).json({ message: "User saved successfully", user: user });
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
};

export default saveUserToDb;