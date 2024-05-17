import User from "../../models/saveUserToDbModel";
import { connectDb } from "../../utils/db";

const fetchWalletAddressWithEmail = async (req, res) => {
    await connectDb();
    if (req.method != "GET") return;
    try {
        const { email } = req.query;
        const walletAddress = await User.findOne({ email: email })
        if (!walletAddress) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        res.status(200).json(walletAddress.walletAddress);
    } catch (error) {
        console.log(error);
    }
}

export default fetchWalletAddressWithEmail;