import "../index.css";
import React, { useState } from "react";
import Header from "./Header";
import Main from "./Main";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import yandexApi from "../utils/api";
import InfoTooltip from "./InfoTooltip";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Route, Switch, useHistory, Redirect } from "react-router-dom";
import errorIcon from "../images/auth-error.svg";
import okIcon from "../images/auth-ok.svg";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(
    false
  );
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(
    false
  );
  const [isSelectedCard, setIsSelectedCard] = React.useState({
    name: "",
    link: "",
  });
  const [currentUser, setCurrentUser] = useState({});
  const [Email, setEmail] = useState("");

  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [cards, setCards] = React.useState([]);
  const [tooltipInfo, setTooltipInfo] = React.useState({
    isOpen: false,
    icon: "",
    text: "",
  });
  const history = useHistory();

  React.useEffect(() => {
    yandexApi.getUserInfo().then((data) => {
      setCurrentUser(data);
    });
  }, [isLoggedIn]);

  React.useEffect(() => {
    yandexApi.getInitialCards().then((data) => {
      setCards(data.data);
    });
  }, [isLoggedIn]);

  React.useEffect(() => {
    handleTokenCheck();
  }, []);

  function handleTokenCheck() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      yandexApi.checkToken(jwt).then((res) => {
        setLoggedIn(true);
        setEmail(res.email);
        history.push("/");
      });
    }
  }

  function handleCardDelete(card) {
    yandexApi.deleteCard(card._id).then(() => {
      const newCards = cards.filter((elem) => elem !== card);
      setCards(newCards);
    });
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    yandexApi.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
      // Формируем новый массив на основе имеющегося, подставляя в него новую карточку

      const newCards = cards.map((c) =>
        c._id === card._id ? newCard.data : c
      );
      // Обновляем стейт

      setCards(newCards);
    });
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsSelectedCard({ name: "", link: "" });
    setTooltipInfo({ isOpen: false, icon: null, text: "" });
  }

  function handleCardClick(card) {
    setIsSelectedCard(card);
  }
  function handleAddPlaceSubmit(data) {
    yandexApi
      .addCard(data)
      .then((newCard) => {
        setCards([newCard.card, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        setTooltipInfo({
          isOpen: true,
          icon: errorIcon,
          text: "Что-то пошло не так! Попробуйте ещё раз",
        });
      });
  }
  async function handleUpdateAvatar(data) {
    yandexApi.setUserAvatar(data).then((avatar) => {
      setCurrentUser(avatar.data);

      closeAllPopups();
    });
  }

  async function handleUpdateUser(data) {
    yandexApi.setUserInfo(data).then((user) => {
      setCurrentUser(user.data);
      closeAllPopups();
    });
  }

  function handleLogin(email, password) {
    yandexApi
      .signIn(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setEmail(email);
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch((err) => {
        setTooltipInfo({
          isOpen: true,
          icon: errorIcon,
          text: "Что-то пошло не так! Попробуйте ещёраз",
        });
      });
  }

  function onSignOut() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    history.push("/signin");
  }

  const handleReg = (email, password) => {
    yandexApi
      .signUp(email, password)
      .then((data) => {
        if (data) {
          setTooltipInfo({
            isOpen: true,
            icon: okIcon,
            text: "Вы успешно зарегистрировались!",
          });
          history.push("/signin");
        } else {
          setTooltipInfo({
            isOpen: true,
            icon: errorIcon,
            text: "Что-то пошло не так! Попробуйте ещё раз",
          });
        }
      })
      .catch((err) => {
        setTooltipInfo({
          isOpen: true,
          icon: errorIcon,
          text: "Что-то пошло не так! Попробуйте ещё раз",
        });
      });
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__container">
          <Header onSignOut={onSignOut} email={Email} isLoggedIn={isLoggedIn} />
          <Switch>
            <ProtectedRoute
              exact
              path="/"
              component={Main}
              isLoggedIn={isLoggedIn}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              onCardClick={handleCardClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
            />

            <Route path="/signup">
              <Register onReg={handleReg} tooltipInfo={setTooltipInfo} />
            </Route>
            <Route path="/signin">
              <Login onLogin={handleLogin} tooltipInfo={setTooltipInfo} />
            </Route>
            <Route>
              {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
            </Route>
          </Switch>
          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <ImagePopup
            card={isSelectedCard}
            onClose={closeAllPopups}
            onCardClick={handleCardClick}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />
          <InfoTooltip onClose={closeAllPopups} tooltipInfo={tooltipInfo} />

          <PopupWithForm name="delete" title="Вы уверены?" buttonText="Да" />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
