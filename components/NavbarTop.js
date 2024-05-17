import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../public/images/consent-wide-logo.png";
import Image from "next/image";
import Link from "next/link";
import style from "../styles/Navbar.module.css"
import { ConnectWallet, useAddress, useWallet } from "@thirdweb-dev/react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { VscBellDot } from "react-icons/vsc";
import { useRouter } from "next/router";
import axios from "axios";

const NavbarTop = () => {
  const [notificationData, setNotificationData] = useState([]);
  const embeddedWallet = useWallet("embeddedWallet");
  const address = useAddress();
  const router = useRouter();

  const getEmail = async () => {
    const email = await embeddedWallet?.getEmail();
    return email;
  };

  const getAllNotifications = async () => {
    const user = await getEmail();
    try {
      let reqOptions = {
        url: `/api/getNotifications?user=${user}`,
        method: "GET",
      }
      let response = await axios.request(reqOptions);
      setNotificationData(response.data.notifications);
    } catch (error) {
      console.error(error.message)
    }
  }

  const naviagteToRequestPage = async (consentId) => {
    router.push(`/request/${consentId}`);
  }

  useEffect(() => {
    getEmail();
    getAllNotifications();
  }, [router, address]);

  return (
    <Navbar style={{ marginBottom: "20px" }}>
      <Container>
        <Navbar.Brand href="/">
          <Image
            src={logo}
            className={style.logo}
            alt="Consent logo"
          />
        </Navbar.Brand>
        <div className="ms-auto p-3">
          <DropdownButton className="notification" id="dropdown-basic-button" title={<VscBellDot size={20} />} >
            {notificationData && notificationData.map((notification, index) =>
              <div key={index} className={index % 2 === 0 ? "bg-white" : "bg-warning"} onClick={() => naviagteToRequestPage(notification.consentId)} >
                <Dropdown.Item key={index}>{notification.consent}</Dropdown.Item>
                <Dropdown.Item >{notification.description}</Dropdown.Item>
              </div>
            )}
          </DropdownButton>
        </div>
        {address ? <ConnectWallet className={style.connectWallet} /> : <Link href="/login">Login</Link>}
      </Container>
    </Navbar>
  );
};

export default NavbarTop;
