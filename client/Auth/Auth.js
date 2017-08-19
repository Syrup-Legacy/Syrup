import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0';
import history from '../history';
import axios from 'axios';

export default class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: AUTH_CONFIG.domain,
      clientID: AUTH_CONFIG.clientID,
      redirectUri: AUTH_CONFIG.redirectUri,
      audience: `https://${AUTH_CONFIG.domain}/userinfo`,
      responseType: 'token id_token',
      scope: 'openid profile'
    });
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    this.auth0.authorize()
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        axios.get('https://austenwma.auth0.com/userinfo', {
          headers: {'Authorization': `Bearer ${authResult.accessToken}`}
        })
    .then(({ data }) => {
      console.log('this is the data', data)
      console.log('this is the datan', data.name)
      console.log('this is the datas', data.sub)
      data.sub = data.sub.slice(data.sub.length - 2)
      axios.post('/api/profile', {
        email: data.name,
        id: data.sub,
        latitude: -117.9354168,
        longitude: 33.9246179
      })
      .then(res => {
        console.log('asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfsdafasdfasdf',res);
        // axios.get('/api/')
      })
      .then(()=> {
        this.setSession(authResult);
      })
    })
    .catch(err => {
      console.log(err)
    })
        // history.replace('/upload');
      } else if (err) {
        // history.replace('/upload');
        console.log(err);
      }
    });
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    console.log('we are in setSesstions')
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    console.log('HERE IS TYPE')
    console.log('HERE IS TYPE', authResult.idTokenPayload['sub'])
    let token = authResult.idTokenPayload['sub'].slice(authResult.idTokenPayload['sub'].length - 2)
    localStorage.setItem('idTokenPayload', token)
    // localStorage.setItem('idTokenPayload', authResult.idTokenPayload[0])
    // console.log('this is the authResesult', JSON.parse(authResult))
// navigate to the home route
    history.replace('/upload');
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
