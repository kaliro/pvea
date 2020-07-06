// libraries
const fetch = require('node-fetch');
const sleep = require('util').promisify(setTimeout);
const colors = require('colors');


// peava module
class peava {

  constructor (host, user, pass){
    this.host = host; // hostname, e.g. pve.example.com.
    this.user = user; // username, e.g. admin@pam, admin@pve.
    this.pass = pass; // password, e.g. hunter2.
    this.apiURL = 'https://' + this.host + ':8006/api2/json';
    this.ticket = '';
    this.csrfToken = '';
    this.authenticated = false;
    this.tokenTimeStamp = 0;
  }

  // authentication.
  function auth() {

    const authURL = 'username=' + this.user + '&password=' + this.pass; // authURL, needed for getting authentication ticket and

    const options = {
      method: 'POST',
      body: authURL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    fetch(this.apiURL + '/access/ticket', options)
      .then( res => {

        if (res.ok) {

          return res.json();

        } else {

          return Promise.reject({ status: res.status, statusText: res.statusText });

        }

      })
      .then( res => {

        this.ticket = 'PVEAuthCookie=' + res.data.ticket;
        this.csrfToken = res.data.CSRFPreventionToken;
        this.authenticated = true;
        this.tokenTimeStamp = new Date().getTime();

        console.log(colors.blue('Note: ') + 'Authentication successful! Authentication tickets expire every two hours. Authenticated: ' + this.authenticated)
        console.log(colors.green('Ticket: ') + this.ticket);
        console.log(colors.green('CSRF Prevention Token: ') + this.csrfToken);

      })
      .catch( err => console.log(colors.red('Error: '), err))

  }

  function apiCall(method, url, data, res) {

    if( method == 'GET') {

      var headers = {
        'Cookies': 'PVEAuthCookie=' + this.ticket,
        'Content-Type':'application/x-www-form-urlencoded'
      }

    } else {

      var headers = {
        'Cookies': 'PVEAuthCookie=' + this.ticket,
        'Content-Type':'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken
      }

    const options = {
        method: method,
        body: authURL,
        headers: headers
    }

    fetch(this.apiURL + url, options)
      .then( res => {

        if (res.ok) {

          return res.json()

        } else {

          return Promise.reject({ status: res.status, statusText: res.statusText });

        }

      })
      .then ( res => {

      })
      .catch( err => console.log(colors.red('Error: '), err))
  }

  function call(method, url, data, res) {

    var currentTime = new Date().getTime();

    if (currentTime - this.tokenTimeStamp > 60 * 60 * 1000) {
      auth()
    } else {

    }

  }


}


module.exports = peava;
