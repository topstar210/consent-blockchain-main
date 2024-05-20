import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner';
import { useAddress } from '@thirdweb-dev/react';
import Loader from './Loader';

const Paywithpaypal = ({ showModal, body }) => {
    const [loading, setLoading] = useState(false);
    const address = useAddress();
    const [bodyData, setBodyData] = useState({
        ...body,
        consentId: null
    });

    const initiateConsentCall = async () => {
        try {
            let headersList = {
                "Accept": "*/*",
            }

            let bodyContent = {
                firstParty: bodyData.from || address,
                secondParty: bodyData.sendToWalletAddress,
                data: bodyData.consentTo
            };

            let reqOptions = {
                url: "/api/smartContract/initiateConsent",
                method: "POST",
                headers: headersList,
                data: bodyContent
            }

            let response = await axios.request(reqOptions);
            return response.data;
        } catch (error) {
            console.error(error.message)
            setLoading(false);
        }
    }


    const requestConsentApi = async (id) => {
        try {
            let headersList = {
                "Content-Type": "application/json"
            }
            let bodywithConsentID = bodyData;
            bodywithConsentID.consentId = id;

            let bodyContent = JSON.stringify(bodywithConsentID);

            let reqOptions = {
                url: "/api/requestConsentApi",
                method: "POST",
                headers: headersList,
                data: bodyContent,
            }

            let consentResponse = await axios.request(reqOptions);
            showModal(true);
            toast.success("Consent initiated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            setLoading(false);
        }
    }

    // paypal congiguration
    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
    };


    const createOrder = async (data) => {

        try {
            const response = await axios.post("/api/paypal/createOrder", {
                product: {
                    description: "My Product Description",
                    cost: "1.09"
                }
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return response.data.id;
        } catch (error) {
            console.error("Error creating order:", error);
            setLoading(false);
        }
    };


    const onApprove = async (data) => {
        try {
            let response = await axios.post("/api/paypal/capturepayment", {
                orderID: data.orderID
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            setLoading(true);

            const contractResponse = await initiateConsentCall();
            
            await requestConsentApi(contractResponse.consentId);
            setLoading(false);

            return response.data;
        } catch (error) {
            console.error("Error capturing payment:", error);
            toast.error("Payment capture failed");
            setLoading(false);
        }
    };

    return (
        <>
            <PayPalScriptProvider options={initialOptions}>
                {loading ? (
                    <Loader />) :
                    <div style={{ maxWidth: "700px", width: "100%" }} className='mx-auto'>

                        <PayPalButtons
                            createOrder={(data, action) => createOrder(data, action)}
                            onApprove={(data, action) => onApprove(data, action)}
                        />
                    </div>}
            </PayPalScriptProvider>
        </>
    )
}

export default Paywithpaypal