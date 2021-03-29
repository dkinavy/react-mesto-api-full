class Api {
  constructor(options) {
    // тело конструктора
    this.options = options;
    this._baseUrl = options.baseUrl;
    this._baseAuthUrl = options.baseAuthUrl;
    this._headers = options.headers;
  }
  getHeader() {
    const token = localStorage.getItem("jwt");
    console.log(token);
    return {
      ...this._headers,
      Authorization: `Bearer ${token}`,
    };
  }
  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }

  getInitialCards() {
    return fetch(this._baseUrl + "/cards", {
      headers: this.getHeader(),
    }).then(this._getResponseData);
    //.catch((err) => alert(err));
  }

  getUserInfo() {
    return fetch(this._baseUrl + "/users/me", {
      headers: this.getHeader(),
    }).then(this._getResponseData);
    //.catch((err) => alert(err));
  }
  // другие методы работы с API
  setUserInfo(info) {
    //console.log(info)
    return fetch(this._baseUrl + "/users/me", {
      method: "PATCH",
      headers: this.getHeader(),
      body: JSON.stringify({
        name: info.name,
        about: info.about,
      }),
    }).then(this._getResponseData);
    //.catch((err) => alert(err));
  }
  setUserAvatar(avatar) {
    console.log("а что такое аватар" + avatar);
    console.log(avatar);
    return fetch(this._baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: this.getHeader(),
      body: JSON.stringify({
        avatar: avatar.link,
      }),
    }).then(this._getResponseData);
    //.catch((err) => alert(err));
  }

  addCard(data) {
    //console.log(data);
    return fetch(this._baseUrl + "/cards", {
      method: "POST",
      headers: this.getHeader(),
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    })
      .then(this._getResponseData)
      .catch((err) => alert(err));
  }
  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this.getHeader(),
    })
      .then(this._getResponseData)
      .catch((err) => alert(err));
  }
  deleteLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "DELETE",
      headers: this.getHeader(),
    })
      .then(this._getResponseData)
      .catch((err) => alert(err));
  }

  putLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "PUT",
      headers: this.getHeader(),
    })
      .then(this._getResponseData)
      .catch((err) => alert(err));
  }

  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return this.deleteLike(id);
    } else {
      return this.putLike(id);
    }
  }

  signIn(email, password) {
    return fetch(`${this._baseAuthUrl}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    })
      .then(this._getResponseData)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          return data;
        } else {
          return;
        }
      })
      .catch((err) => console.log(err));
  }
  signUp(email, password) {
    return fetch(`${this._baseAuthUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    })
      .then(this._getResponseData)
      .then((data) => {
        if (data) {
          //console.log(data);
          return data;
        } else {
          return;
        }
      })
      .catch((err) => console.log(err));
  }
  checkToken(token) {
    return fetch(`${this._baseAuthUrl}/users/me`, {
      method: "GET",
      headers: this.getHeader(),
    })
      .then(this._getResponseData)
      .then((data) => data);
  }
}

const yandexApi = new Api({
  baseUrl: "http://localhost:3001",
  baseAuthUrl: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export default yandexApi;
