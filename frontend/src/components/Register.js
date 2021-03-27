import React from "react";
import AuthWithForm from "./AuthWithForm";
import { Link } from "react-router-dom";
// import yandexApi from "../utils/api";
// import errorIcon from "../images/auth-error.svg";
// import okIcon from "../images/auth-ok.svg";

function Register({ tooltipInfo, onReg }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // const history = useHistory();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onReg(email, password);
  };

  return (
    <AuthWithForm onSubmit={handleSubmit} title="Регистрация">
      <div className="auth__field">
        <input
          type="email"
          className="auth__item"
          name="email"
          placeholder="Email"
          id="email"
          onChange={(evt) => {
            setEmail(evt.target.value);
          }}
          required
          value={email}
        />
      </div>
      <div className="auth__field">
        <input
          type="password"
          className="auth__item"
          name="password"
          placeholder="Пароль"
          id="password-input"
          required
          value={password}
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
        />
      </div>
      <button type="submit" className="auth__submit" value="Зарегистрироваться">
        Зарегистрироваться
      </button>
      <p className="auth__text">
        Уже зарегистрированы?{" "}
        <Link className="auth__link" to="/signin" onClick={onReg.onClick}>
          Войти
        </Link>
      </p>
    </AuthWithForm>
  );
}

export default Register;
