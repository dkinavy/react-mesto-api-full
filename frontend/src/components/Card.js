import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = props.card.owner === currentUser._id;

  const a = props.card.likes;
  const isLiked = a.some((i) => i === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = `card__delete-button ${
    isOwn ? "element__trash" : "element__trash_hidden"
  }`;
  const cardLikeButtonClassName = `${
    isLiked ? "element__icon element__icon_active" : "element__icon"
  }`;
  // element__icon

  function handleClick() {
    props.onCardClick(props.card);
  }
  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleCardDelete() {
    props.onCardDelete(props.card);
  }

  return (
    <div className="element">
      <img
        className="element__image"
        src={props.card.link}
        alt={props.card.name}
        onClick={handleClick}
      />
      <button
        className={cardDeleteButtonClassName}
        onClick={handleCardDelete}
        type="button"
      ></button>
      <div className="element__title">
        <h2 className="element__name">{props.card.name}</h2>
        <div className="element__likes-container">
          <button
            onClick={handleLikeClick}
            className={cardLikeButtonClassName}
            type="button"
          ></button>
          <span className="element__like-count">{props.card.likes.length}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
