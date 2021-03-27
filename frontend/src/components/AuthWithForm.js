import React from "react";

function AuthWithForm(props) {
  return (
    <div className={`auth page__container'}`}>
      <form
        className="auth__form"
        name="login"
        noValidate
        onSubmit={props.onSubmit}
      >
        <h2 className="auth__header">{props.title}</h2>
        {props.children}
      </form>
    </div>
  );
}

export default AuthWithForm;
