import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {

  const avatarRef = React.useRef('');

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onUpdateAvatar({
      link: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm  
      name = "avatar"
      title = "Обнови аватар"
      buttonText = "Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}>
          

            <input type="url" id="link" className="popup__input popup__input_type_link" required
             placeholder="Ссылка на картинку" ref={avatarRef} />
            <span id="link-error" className="error"></span>
      </PopupWithForm>
    
    
    
    



  )
}

export default EditAvatarPopup;