import fetch from "node-fetch";
import generateAccessToken from "./generateAccessToken";
import handleResponse from "./handleResponse";

const createOrder = async (cart) => {
  const base = process.env.PAYPAL_BASE_URL;

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: cart.cost
        },
        description: cart.description,
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export default createOrder;