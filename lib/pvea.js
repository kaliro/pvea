// libraries
const fetch = require('node-fetch')
const colors = require('colors')
const sleep = require('util').promisify(setTimeout)

// pvea module
class pvea {

  constructor (host, user, pass) {
    this.host = host
    this.user = user
    this.pass = pass
    this.apiUrl = 'https://' + this.host + ':8006/api2/json'
    this.ticket = ''
    this.csrfToken = ''
    this.tokenTimeStamp = 0
    this.authenticated = false
  }

  // authentication function
  authenticate (callback) {
    const authUrl = 'username=' + this.user + '&password=' + this.pass

    const options = {
      method: 'POST',
      body: authUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    fetch(this.apiUrl + '/access/ticket', options)
    .then( res => {
      if (res.ok) {
        return res.json()
      } else {
        return Promise.reject({ status: res.status, statusText: res.statusText })
      }
    })
    .then( res => {
      this.ticket = 'PVEAuthCookie=' + res.data.ticket;
      this.csrfToken = res.data.CSRFPreventionToken;
      this.authenticated = true;
      this.tokenTimeStamp = new Date().getTime();

      callback(this.ticket)

    })
    .catch( err => console.log(colors.red('Error: '), err))

  }

}

module.exports = pvea
