import React from "react";
import Link from "next/link";
import style from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <div className={style.main}>
      <div className="d-md-flex footerWrapper text-light justify-content-between">
        <span style={{ opacity: "0.5" }}>
          Copyright &copy; 2024 for Consent on the Blockchain. All rights
          reserved.
        </span>
        <div className="d-flex links">
          <Link
            href="/"
            className="text-light text-decoration-none"
            style={{ opacity: "0.5" }}
          >
            Terms & Conditions
          </Link>
          <span className="mx-2" style={{ opacity: "0.5" }}>
            |
          </span>
          <Link
            href="/"
            className="text-light text-decoration-none"
            style={{ opacity: "0.5" }}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
