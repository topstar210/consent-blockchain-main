import Web3 from "web3";
import { connectDb } from "../../utils/db";
import { MyContract } from "../../utils/MyContract";
const address = process.env.NEXT_PUBLIC_BACKEND_WALLET_ADDRESS;
const privateKey = process.env.NEXT_PUBLIC_BACKEND_WALLET_PRIVATE_KEY;
const infuraUrl = process.env.NEXT_PUBLIC_INFURA_URL;

const backendWallet = async (req, res) => {
  await connectDb();
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { firstParty, secondParty } = req.body;
  const ConsentData = req.body.data;

  try {
    const web3 = new Web3(infuraUrl);
    const networkId = await web3.eth.net.getId();
    const myContract = new web3.eth.Contract(
      MyContract,
      process.env.NEXT_PUBLIC_BACKEND_CONTRACT_ADDRESS
    );

    web3.eth.accounts.wallet.add(privateKey);
    const tx = myContract.methods.initiateConsent
      (firstParty, secondParty, ConsentData);
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
    const consentId = parseInt(receipt.logs[0].topics[1]);
    return res.status(200).json({ message: `Transaction hash: ${receipt.transactionHash}`, consentId: consentId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
}

export default backendWallet;