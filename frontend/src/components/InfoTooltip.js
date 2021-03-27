import React from "react";

function InfoTooltip({ onClose, tooltipInfo }) {
  return (
    <div
      id="infoTooltip"
      className={`popup ${tooltipInfo.isOpen ? "popup_opened" : ""}`}
      onClick={onClose}
    >
      <div className="popup__container">
        <img
          className="popup__auth-icon"
          src={tooltipInfo.icon}
          alt="tooltip"
        />
        <p className="popup__auth-text">{tooltipInfo.text}</p>
        <button
          className="popup__auth-close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
        />
      </div>
    </div>
  );
}

export default InfoTooltip;
