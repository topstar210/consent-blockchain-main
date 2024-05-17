import Web3 from "web3";
import { MyContract } from "../../../utils/MyContract";
import { connectDb } from "../../../utils/db";
import notificationModel from "../../../models/notificationModel";

const address = process.env.NEXT_PUBLIC_BACKEND_WALLET_ADDRESS;
const privateKey = process.env.NEXT_PUBLIC_BACKEND_WALLET_PRIVATE_KEY;
const infuraUrl = process.env.NEXT_PUBLIC_INFURA_URL;

const respondToConsent = async (req, res) => {
    await connectDb();
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    const { consentId, isAccepted, user } = req.body;
    const consentIdInt = parseInt(consentId);
    
    try {
        const web3 = new Web3(infuraUrl);
        const networkId = await web3.eth.net.getId();
        const myContract = new web3.eth.Contract(
            MyContract,
            process.env.NEXT_PUBLIC_BACKEND_CONTRACT_ADDRESS
        );

        web3.eth.accounts.wallet.add(privateKey);
        const tx = myContract.methods.respondToConsent
            (consentIdInt, isAccepted);
        const gas = await tx.estimateGas({ from: address });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();
        const nonce = await web3.eth.getTransactionCount(address);
        const txData = {
            from: address,
            to: myContract.options.address,
            data: data,
            gas,
            gasPrice,
            nonce,
            chainId: networkId
        };
        const receipt = await web3.eth.sendTransaction(txData);

        if (receipt.transactionHash) {
            try {

                const updatedNotification = await notificationModel.findOneAndUpdate(
                    { user: user, 'notifications.consentId': consentIdInt },
                    { $pull: { 'notifications': { consentId: consentIdInt } } },
                    { new: true }
                );

                if (updatedNotification) {
                    return res.status(200).json({ message: "Notification deleted successfully.", transactionHash: receipt.transactionHash});
                } else {
                    return res.status(200).json({ message: "Notification deleted successfully.", transactionHash: receipt.transactionHash});
                }
            } catch (error) {
                return res.status(500).json({ message: error });
            }
        }
        return res.status(200).json({ message: `Transaction hash: ${receipt.transactionHash}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error });
    }
}

export default respondToConsent;