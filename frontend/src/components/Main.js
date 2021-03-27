import React from 'react'
import '../utils/api'

import Card from './Card';
import  {CurrentUserContext}  from '../contexts/CurrentUserContext';

function Main(props) {

    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main className="content">
        <section className="profile">
          <div className="profile__container-avatar">
            <img src={currentUser.avatar} alt="Фото профиля" className="profile__avatar" />
            <button onClick={props.onEditAvatar} className="profile__avatar-edit-button"></button>
          </div>
          <div className="profile__info">
            <div className="profile__name-container">
              <h1 className="profile__info-name">{currentUser.name}</h1>
              <button className="profile__edit-button" onClick={props.onEditProfile} type="button"></button>
            </div>
            <p className="profile__info-title">{currentUser.about}</p>
          </div>
          <button onClick={props.onAddPlace} className="profile__add-button" type="button"></button>
        </section>
  
        <section className="elements">
        {props.cards.map((card) => (
                    <Card card={card} 
                    onCardClick={props.onCardClick} 
                    key={card._id} 
                    onCardLike={props.onCardLike}
                    onCardDelete={props.onCardDelete}/>
                ))}
        </section>
  
      </main>
    )
}

export default Main;

