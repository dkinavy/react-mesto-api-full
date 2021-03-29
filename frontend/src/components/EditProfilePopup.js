import React from "react";
import PopupWithForm from "./PopupWithForm";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  // Подписка на контекст
  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  function handleChangeName(evt) {
    setName(evt.target.value);
  }

  function hanldeChangeDescription(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(evt) {
    // Запрещаем браузеру переходить по адресу формы
    evt.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name: name,
      about: description,
    });
  }
  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  React.useEffect(() => {
    console.log(currentUser);
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  return (
    <PopupWithForm
      name="profile"
      title="Редактировать профиль"
      buttonText="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        id="name"
        required
        minLength="2"
        maxLength="40"
        className="popup__input popup__input_type_name"
        placeholder="Имя"
        onChange={handleChangeName}
        value={name || ""}
      />
      <span id="name-error" className="error"></span>
      <input
        type="text"
        id="job"
        required
        minLength="2"
        maxLength="200"
        className="popup__input popup__input_type_job"
        placeholder="О себе"
        onChange={hanldeChangeDescription}
        value={description || ""}
      />
      <span id="job-error" className="error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
