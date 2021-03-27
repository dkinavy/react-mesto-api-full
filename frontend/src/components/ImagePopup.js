
import React from 'react';

function ImagePopup(props) {
  return (
        <div className={`popup popup__fullimage ${props.card.link && 'popup_opened'}`}>
          <div className="popup__image-container">
            <button type="button" onClick={props.onClose} className="popup__close popup__close-type-fullimage"></button>
            <img src={props.card.link} alt={props.card.name} className="popup__image-popup image-popup" />
            <h3 className="popup__image-title">{props.card.name}</h3>
          </div>
        </div>
  )
}

export default ImagePopup;