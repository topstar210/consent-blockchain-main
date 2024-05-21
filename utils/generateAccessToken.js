import fetch from "node-fetch";

const generateAccessToken = async () => {
    const base = process.env.PAYPAL_BASE_URL;
    // const base = "https://api-m.sandbox.paypal.com";
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_KEY;
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_SECRET_KEY;
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
        ).toString("base64");
        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json();
        return data.access_token;

    } catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
};

export default generateAccessToken;