import captureOrder from "../../../utils/captureOrder";

const capturepayment = async (req, res) => {
    try {
        const { orderID } = req.body;
        const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
}

export default capturepayment;