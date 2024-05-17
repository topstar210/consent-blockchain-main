import { Container } from "react-bootstrap";
import ConsentConfirmation from "../../components/ConsentConfirmation";
import NavbarTop from "../../components/NavbarTop";
import Footer from "../../components/Footer";
import style from "../../styles/Consent.module.css";
import Image from "next/image";
import thumbsup from "../../public/images/thumbsup.svg";
import thumbsdown from "../../public/images/thumbsdown.svg";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useWallet } from "@thirdweb-dev/react";
import { toast } from "sonner";

function RequestPage() {
  const [transactionHash, setTransactionHash] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const embeddedWallet = useWallet("embeddedWallet");
  const router = useRouter();
  const consentId = router.query.request;

  const getEmail = async () => {
    const email = await embeddedWallet?.getEmail();
    return email;
  };

  const acceptConsent = async () => {
    try {
      const email = await getEmail();

      let headersList = {
        "Accept": "*/*",
      };

      let bodyContent = {
        consentId: consentId,
        isAccepted: true,
        user: email
      };

      let reqOptions = {
        url: "/api/smartContract/respondToConsent",
        method: "POST",
        headers: headersList,
        data: bodyContent
      };

      const response = await axios.request(reqOptions);
      setTransactionHash(response.data.transactionHash);
      setModalShow(true);

    } catch (error) {
      console.error(error.message);
      toast.error("Failed to accept consent");
    }
  };



  const rejectConsent = async () => {
    try {
      let headersList = {
        "Accept": "*/*",
      };

      let bodyContent = {
        consentId: consentId,
        isAccepted: false
      };

      let reqOptions = {
        url: "/api/smartContract/respondToConsent",
        method: "POST",
        headers: headersList,
        data: bodyContent
      };

      const response = await axios.request(reqOptions);

      console.log(response.data.transactionHash);
      setTransactionHash(response.data.transactionHash);
      setModalShow(true);
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to reject consent");
    }
  };



  const accepthandler = async () => {
    toast.promise(acceptConsent, {
      loading: "Accepting consent...",
      success: "Consent accepted successfully",
      error: "Failed to accept consent"
    })
  }

  const rejecthandler = async () => {
    toast.promise(rejectConsent, {
      loading: "Rejecting consent...",
      success: "Consent rejected successfully",
      error: "Failed to reject consent"
    })
  }


  useEffect(() => {
    getEmail();
  }, [router]);

  return (
    <>
      <NavbarTop />
      <ConsentConfirmation show={modalShow} onHide={() => setModalShow(false)} transactionHash={transactionHash} />
      <Container className={style.main}>
        <h1 className={style.title}>Confirm Consent</h1>
        <div className={style.subtitle}>Do You Consent to Proceeding?</div>
        <div className={style.confirmationContainer}>
          <div className={style.confirmationBox} onClick={accepthandler}>
            <Image src={thumbsup} alt="accept consent" className={style.image}></Image>
            <div className={style.confirmationText} >YES, I Consent</div>
          </div>
          <div className={style.confirmationBox} onClick={rejecthandler}>
            <Image src={thumbsdown} alt="reject consent" className={style.image}></Image>
            <div className={style.confirmationText} >NO, I Do Not Consent</div>
          </div>
        </div>
        <button type="button" className={style.button} onClick={() => setModalShow(true)}>
          Oops, Incorrect Number/Email
        </button>
        <Footer />
      </Container>
    </>
  );
}

export default RequestPage;
