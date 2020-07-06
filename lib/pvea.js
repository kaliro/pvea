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
    this.csrfToken  = ''
    this.tokenTimeStamp = 0
    this.authenticated = false

  }

  // authentication
  start (callback) {

    console.log(colors.blue('Note: ') + 'Starting authentication process...')

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

      console.log(colors.blue('Note: ') + 'Authentication successful!')

      callback()
    })
    .catch( err => console.log(colors.red('Error: '), err))

  }

  // send API request
  sendReq (methodType, url, data, callback) {
    var headers;
    var options;

    if (methodType === 'GET') {
      headers = {
        'Content-Type':'application/x-www-form-urlencoded',
        'Cookie': this.ticket
      }
      options = {
        method: methodType,
        headers: headers
      }
    } else {
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken,
        'Cookie': this.ticket
      }
      options = {
        method: methodType,
        headers: headers,
        body: data
      }
    }

    fetch(this.apiUrl + url, options)
    .then( res => {
      if (res.ok) {
        return res.json()
      } else {
        return Promise.reject({ status: res.status, statusText: res.statusText })
      }
    })
    .then( res => {
        callback(res.data)
    })
    .catch( err => console.log(colors.red('Error: '), err))

  }

}

module.exports = pvea
