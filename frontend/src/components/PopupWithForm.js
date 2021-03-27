import React from "react";

function PopupWithForm(props){
    return(
        <div className={`popup popup__${props.name} ${props.isOpen && 'popup_opened'}`}>
        <div className="popup__container">
          <button onClick={props.onClose} type="reset" className="popup__close"></button>
          <form className="popup__form" name={props.name} noValidate onSubmit={props.onSubmit}>
            <h2 className="popup__title">{props.title}</h2>
            {props.children}
            <button type="submit" className="popup__save">{props.buttonText}</button>
          </form>
        </div>
      </div>
          
        )
}

export default PopupWithForm