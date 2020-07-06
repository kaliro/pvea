// libraries
const fetch = require('node-fetch');
const sleep = require('util').promisify(setTimeout);
const colors = require('colors');


// peava module
class peava {


  // authentication
  constructor (host, user, pass){
    this.host = host; // hostname, e.g. pve.example.com.
    this.user = user; // username, e.g. admin@pam, admin@pve.
    this.pass = pass; // password, e.g. hunter2.
    this.apiURL = 'https://' + this.host + ':8006/api2/json';
    this.ticket = '';
    this.csrfToken = '';
    this.authenticated = false;
  }

  // authentication function.

  async getAuthenticationTicket() {

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

        console.log(colors.blue('Note: ') + 'Authentication successful! Authentication tickets expire every two hours, it may be best to have a script in your app rerun pvea.getAuthenticationTicket() before making a request. ' + this.authenticated)
        console.log(colors.green('Ticket: ') + this.ticket);
        console.log(colors.green('CSRF Prevention Token: ') + this.csrfToken);

      })
      .catch( err => console.log(colors.red('Error: '), err))

  }
}


module.exports = peava;
