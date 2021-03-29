import React from "react";
import logo from "../images/mesto.svg";
import { Link, useLocation } from "react-router-dom";

function Header({ isLoggedIn, email, onSignOut }) {
  const location = useLocation();
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип сайта Место" />
      {isLoggedIn && location.pathname === "/" ? (
        <>
          <p className="header__email">{email}</p>
          <button className="header__signout-button" onClick={onSignOut}>
            Выйти
          </button>
        </>
      ) : (
        <Link
          to={location.pathname === "/signin" ? "/signup" : "/signin"}
          className="header__auth-link"
        >
          {location.pathname === "/signin" ? "Регистрация" : "Вход"}
        </Link>
      )}
    </header>
  );
}

export default Header;
