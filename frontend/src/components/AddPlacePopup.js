import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {

    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');

    function handleChangeName(evt) {
        setName(evt.target.value);
    }

    function handleChangeLink(evt) {
        setLink(evt.target.value);
    }

    function handleSubmit(evt) {
        evt.preventDefault(evt);
        props.onAddPlace({
            name: name,
            link: link,
        })
    }

    return (
        <PopupWithForm


            name="profile"
            title="Новое место"
            buttonText="Создать"
            isOpen={props.isOpen}
            onClose={props.onClose}
            onSubmit={handleSubmit}>

            <input type="text" id="place"
                className="popup__input popup__input_type_place"
                minLength="2"
                maxLength="30"
                required placeholder="Название"
                value={name}
                onChange={handleChangeName} />
            <span id="place-error" className="error"></span>
            <input type="url" id="link"
                className="popup__input popup__input_type_link" required
                placeholder="Ссылка на картинку"
                value={link}
                onChange={handleChangeLink} />
            <span id="link-error" className="error"></span>

        </PopupWithForm>
    )
}

export default AddPlacePopup;