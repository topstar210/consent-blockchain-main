import { useState, useEffect } from "react";
import { useAddress, useConnectionStatus, useWallet } from "@thirdweb-dev/react";
import { Col, Container, Row } from "react-bootstrap";
import NavbarTop from "../components/NavbarTop";
import InvitationConfirmation from "../components/InvitationConfirmation";
import style from "../styles/Home.module.css";
import Form from "react-bootstrap/Form";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import axios from "axios";
import Paywithpaypal from "../components/Paywithpaypal.js";
import { toast } from "sonner";

/**
 * Renders the Homepage component.
 * This component displays a form for confirming consent.
 * It includes fields for consent, recipient, and payment option.
 * The user can navigate to another page if the address is not provided.
 *
 * @returns {JSX.Element} The rendered Homepage component.
*/
const Homepage = () => {
  const [modalShow, setModalShow] = useState(false);
  const [togglePaymentOptions, setTogglePaymentOptions] = useState(false);
  const connectionStatus = useConnectionStatus();
  const address = useAddress();
  const router = useRouter();
  const [requestConsentBody, setRequestConsentBody] = useState({
    from: address,
    consentTo: "",
    sendTo: "",
    sendToWalletAddress: ""
  });

  // Function to navigate to another page
  const navigateToAnotherPage = () => {
    if (connectionStatus === "disconnected") {
      router.push("/login");
    }
  };

  const getWalletAddressWithEmail = async (email) => {
    try {
      let headersList = {
        "Accept": "*/*"
      }

      let reqOptions = {
        url: "/api/fetchWalletAddressWithEmail",
        method: "GET",
        headers: headersList,
        params: {
          email: email
        }
      }

      let response = await axios.request(reqOptions);
      setTogglePaymentOptions(true);
      return response.data;
    } catch (error) {
      setTogglePaymentOptions(false)
      toast.error(error.response.data.message || "Something went wrong");
      console.error(error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // get wallet address from the email
    const sendToWalletAddress = await getWalletAddressWithEmail(e.target.formReceiver.value)
    setRequestConsentBody({
      ...requestConsentBody,
      from: address,
      consentTo: e.target.formConsent.value,
      sendTo: e.target.formReceiver.value,
      sendToWalletAddress: sendToWalletAddress
    });
  }


  useEffect(() => {
    navigateToAnotherPage();
  }, [router, address, connectionStatus]);
  return (
    <div className="home">
      <Row >
        <Col>
          <NavbarTop />
          <InvitationConfirmation show={modalShow}
            onHide={() => setModalShow(false)} />
        </Col>
      </Row >
      <Container className="mb-4">
        <div className={style.main}>
          <h1 className={style.title}>Confirm Consent</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formConsent">
              <Form.Label className={style.label}>Consent To:</Form.Label>
              <Form.Control
                type="text"
                className={style.input}
                placeholder="e.g. Dinner, Date"
                disabled={address === null || togglePaymentOptions}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formReceiver">
              <Form.Label className={style.label}>Send To:</Form.Label>
              <Form.Control
                type="text"
                className={style.input}
                placeholder="Email or Phone Number"
                disabled={address === null || togglePaymentOptions}
                required
              />
            </Form.Group>
            <div
              className="position-relative mx-auto"
              style={{ width: "auto" }}
            >
              <button type="submit" className={style.button} disabled={address === null}>
                Get Started
              </button>
            </div>
          </Form>
          {togglePaymentOptions && <div className="mt-5">
            <Form.Label className={style.label}>Payment Option:</Form.Label>
            <Paywithpaypal showModal={setModalShow} body={requestConsentBody} />
          </div>}
          <Footer />
        </div>
      </Container>
    </div>
  );
};

export default Homepage;
