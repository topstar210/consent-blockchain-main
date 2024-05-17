import createOrder from "../../../utils/createOrder";

const createorder = async (req, res) => {
    try {
        const { product } = req.body;
        const { jsonResponse, httpStatusCode } = await createOrder(product);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
}

export default createorder;