import React from "react";
import style from "../styles/Invitation.module.css";
import invitationIcon from "../public/images/invitaion.svg";
import closeIcon from "../public/images/closeIcon.svg";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import { useRouter } from "next/router";

const Invitation = (props) => {
  const router = useRouter();
  return (
    <>
      <Modal
        {...props}
        backdrop="static"
        size="lg"
        keyboard={false}
        dialogClassName={style.modal}
        style={{ background: "rgb(0,0,0,0.7)" }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className={style.main}>
          <div className={style.closeButton} onClick={props.onHide}>
            <Image src={closeIcon} alt="close icon" fill closeButton></Image>
          </div>
          <Image
            src={invitationIcon}
            alt="invitation icon"
            width={220}
            height={180}
            className="mt-4"
          ></Image>
          <h1 className={style.title}>Invitation Sent!</h1>
          <span className={style.subtitle}>
            Link sent.Awaiting confirmation.
          </span>
          <button className={style.button} onClick={() => { router.push('/'); props.onHide() }}>Continue</button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Invitation;
