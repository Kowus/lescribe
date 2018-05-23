import moment from 'moment';

var AuthPlugin = {
  setToken(token, expiration) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authTokenExpiration', expiration);
  },
  getToken() {
    let token = localStorage.getItem('authToken');
    let expiration = localStorage.getItem('authTokenExpiration');

    if (!token || !expiration) return null;
    if (moment() - moment(new Date(expiration)) > 0) {
      this.destroyToken();
      return null;
    } else {
      return token;
    }
  },
  destroyToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiration');
  },
  loggedIn() {
    if (this.getToken()) return true;
    else return false;
  }
};

export default Vue => {
  Vue.auth = AuthPlugin;
  Object.defineProperties(Vue.prototype, {
    $auth: {
      get() {
        return Vue.auth;
      }
    }
  });
};
