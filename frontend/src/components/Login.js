import React from "react";
// import { Link, useHistory } from "react-router-dom";
import AuthWithForm from "./AuthWithForm";
// import yandexApi from "../utils/api";
// import errorIcon from "../images/auth-error.svg";

function Login({ tooltipInfo, onLogin }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // const history = useHistory();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onLogin(email, password);
  };

  return (
    <AuthWithForm onSubmit={handleSubmit} title="Вход">
      <div className="auth__field">
        <input
          type="email"
          className="auth__item"
          name="email"
          placeholder="Email"
          id="email"
          required
          value={email}
          onChange={(evt) => {
            setEmail(evt.target.value);
          }}
          minLength="2"
          maxLength="40"
        />
      </div>
      <div className="auth__field">
        <input
          type="password"
          className="auth__item"
          name="password"
          placeholder="Пароль"
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
          id="password"
          required
          value={password}
        />
      </div>
      <button type="submit" className="auth__submit" value="Войти">
        Войти
      </button>
    </AuthWithForm>
  );
}

export default Login;
