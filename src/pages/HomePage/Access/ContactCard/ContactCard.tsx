import React from "react";
import { Link } from "react-router-dom";
import "./ContactCard.css";
interface ContactCardProps {
  contentTitle: string;
  text: string;
  btnMsg: string;
  borderColor: string;
  textColor: string;
  idButton: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}
export default function ContactCard({
  contentTitle,
  text,
  btnMsg,
  borderColor,
  textColor,
  idButton,
  onClick
}: ContactCardProps) {
  return (
    <div className="contact-card-content">
      <div className="left-side">
        <p className="title-card">{contentTitle}</p>
        <p className="text-card">{text}</p>
      </div>
      <div className="btn-card-container">
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            window.open(
              "https://wa.me/SEU_NUMERO_DE_TELEFONE?text=Olá! Tenho uma dúvida.",
              "_blank"
            );
          }}
        >
          <button
            id={idButton}
            className="btn-card"
            style={{
              border: `1px solid ${borderColor}`,
              color: `${textColor}`,
            }}
          >
            {btnMsg}
          </button>
        </Link>
      </div>
    </div>
  );
}
