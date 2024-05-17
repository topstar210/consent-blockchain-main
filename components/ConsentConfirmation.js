import React from "react";
import style from "../styles/Confirmation.module.css";
import consentConfirm from "../public/images/conestConfirm.svg";
import closeIcon from "../public/images/closeIcon.svg";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";

const ConsentConfirmation = (props) => {
  return (
    <>
      <Modal
        {...props}
        backdrop="static"
        size="lg"
        style={{ background: "rgb(0,0,0,0.74)" }}
        keyboard={false}
        dialogClassName={style.modal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className={style.main}>
          <div className={style.closeButton} onClick={props.onHide}>
            <Image src={closeIcon} alt="close icon" fill closeButton></Image>
          </div>
          <Image
            src={consentConfirm}
            alt="confirm icon"
            width={220}
            height={180}
            className="mt-4"
          ></Image>
          <h1 className={style.title}>You both consented !!</h1>
          <span className={style.subtitle}>
            This has been recorded securely on the blockchain.
          </span>
          <span className={style.transactionID}>
            Blockchain transaction ID:{" "}
            <a href={`https://mumbai.polygonscan.com/tx/${props.transactionHash}`} target="_blank" className="fw-bold text-decoration-none cursor-pointer">
              {props.transactionHash}
            </a>
          </span>
          <button className={style.button} onClick={props.onHide}>Continue</button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConsentConfirmation;
