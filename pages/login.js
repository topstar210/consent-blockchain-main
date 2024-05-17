import React, { useEffect } from "react";
import NavbarTop from "../components/NavbarTop";
import Footer from "../components/Footer";
import style from "../styles/Login.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useAddress, useEmbeddedWallet, useWallet } from "@thirdweb-dev/react";
import { toast } from "sonner";
import { useRouter } from "next/router";

/**
 * Renders the Login component.
 * This component handles user login functionality, including sign-in with Google and Facebook.
 * @returns {JSX.Element} The rendered Login component.
 */
const Login = () => {
  const embeddedWallet = useWallet("embeddedWallet");
  const { connect } = useEmbeddedWallet();
  const address = useAddress();
  const router = useRouter();

  if (address) {
    router.push("/");
  }

  const getEmail = async () => {
    const email = await embeddedWallet?.getEmail();
    return email;
  };

  const saveDataToDb = async () => {
    try {
      const res = await fetch("/api/saveUserToDb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: await getEmail(),
          walletAddress: await address,
        }),
      });
      const data = await res.json();
    } catch (error) {
      console.error("Error saving data to the database:", error.message);
    }
  };


  const signInWithGoogle = async () => {
    try {
      await connect({ strategy: "google" });
      toast.success("Success");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const signInWithFacebook = async () => {
    try {
      await connect({ strategy: "facebook" });
      toast.success("Success");
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (address) {
      saveDataToDb();
    }
  }, [address]);


  return (
    <>
      <NavbarTop />
      <Container>
        <div className={style.main}>
          <h1 className={style.title}>Consent on the Blockchain</h1>
          <h2 className={style.subtitle}>Log Into Your Account</h2>
          <Row xs={1} md={2}>
            <Col className="mb-3 mb-md-0">
              <button className={style.button} onClick={signInWithGoogle}>
                <FcGoogle className="me-2" size={34} />
                <span className={style.buttonText}>Continue with Google</span>
              </button>
            </Col>
            <Col>
              <button className={style.button} onClick={signInWithFacebook}>
                <FaFacebook size={34} className="me-2" color="#286ddf" />
                <span className={style.buttonText}>Continue with Facebook</span>
              </button>
            </Col>
          </Row>
          <Footer />
        </div>
      </Container>
    </>
  );
};

export default Login;
