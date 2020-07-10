// libraries
const axios = require('axios')
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

  async run(callback) {

    console.log(colors.blue('Note: ') + 'Starting authentication process...')

    const authUrl = 'username=' + this.user + '&password=' + this.pass

    const options = {
      method: 'POST',
      data: authUrl,
      url: this.apiUrl + '/access/ticket',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    await axios(options)
    .then( res => {
      this.ticket = 'PVEAuthCookie=' + res.data.data.ticket
      this.csrfToken = res.data.data.CSRFPreventionToken
      this.authenticated = true
      this.tokenTimeStamp = new Date().getTime()
    })
    .catch( err => {
      console.log(colors.red('Err: ') + err)
    })

    if (this.authenticated === true) {
      console.log(colors.blue('Note: ') + 'Authentication successful!')
    } else {
      console.log(colors.red('Err: ') + 'Authentication failed.')
    }

    await callback()
  }

  async getVersion() {
    console.log(colors.blue('Note: ') + 'Executing getVersion()...')
    var data

    const options = {
      method: 'GET',
      data: '',
      url: this.apiUrl + '/version',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken,
        'Cookie': this.ticket
      }
    }

    await axios(options)
    .then( res => {
      console.log(colors.blue('Note: ') + 'Recieved response from getVersion().')
      data = res.data.data
    })
    .catch( err => {
      console.log(colors.red('Err: ') + err)
    })

    return data
  }

  async getNodes() {
    console.log(colors.blue('Note: ') + 'Executing getNodes()...')
    var data

    const options = {
      method: 'GET',
      data: '',
      url: this.apiUrl + '/nodes',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken,
        'Cookie': this.ticket
      }
    }

    await axios(options)
    .then( res => {
      console.log(colors.blue('Note: ') + 'Recieved response from getNodes().')
      data = res.data.data
    })
    .catch( err => {
      console.log(colors.red('Err: ') + err)
    })

    return data
  }

  async getNodeVersion(node) {
    console.log(colors.blue('Note: ') + 'Executing getNodeVersion()...')
    var data

    const options = {
      method: 'GET',
      data: '',
      url: this.apiUrl + '/nodes/' + node + '/version',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken,
        'Cookie': this.ticket
      }
    }

    await axios(options)
    .then( res => {
      console.log(colors.blue('Note: ') + 'Recieved response from getNodeVersion().')
      data = res.data.data
    })
    .catch( err => {
      console.log(colors.red('Err: ') + err)
    })

    return data
  }

  async getNodeTime(node) {
    console.log(colors.blue('Note: ') + 'Executing getNodeTime()...')
    var data

    const options = {
      method: 'GET',
      data: '',
      url: this.apiUrl + '/nodes/' + node + '/time',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken,
        'Cookie': this.ticket
      }
    }

    await axios(options)
    .then( res => {
      console.log(colors.blue('Note: ') + 'Recieved response from getNodeTime().')
      data = res.data.data
    })
    .catch( err => {
      console.log(colors.red('Err: ') + err)
    })

    return data
  }

  async getNodeStatus(node) {
    console.log(colors.blue('Note: ') + 'Executing getNodeStatus()...')
    var data

    const options = {
      method: 'GET',
      data: '',
      url: this.apiUrl + '/nodes/' + node + '/status',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken,
        'Cookie': this.ticket
      }
    }

    await axios(options)
    .then( res => {
      console.log(colors.blue('Note: ') + 'Recieved response from getNodeStatus().')
      data = res.data.data
    })
    .catch( err => {
      console.log(colors.red('Err: ') + err)
    })

    return data
  }

  async getNodeLog(node, param) {
    console.log(colors.blue('Note: ') + 'Executing getNodeLog()...')
    var data

    const options = {
      method: 'GET',
      params: param,
      url: this.apiUrl + '/nodes/' + node + '/syslog',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken,
        'Cookie': this.ticket
      }
    }

    await axios(options)
    .then( res => {
      console.log(colors.blue('Note: ') + 'Recieved response from getNodeLog().')
      data = res.data.data
    })
    .catch( err => {
      console.log(colors.red('Err: ') + err)
    })

    return data
  }

  async getNodeTasks(node, param) {
    console.log(colors.blue('Note: ') + 'Executing getNodeTasks()...')
    var data

    const options = {
      method: 'GET',
      params: param,
      url: this.apiUrl + '/nodes/' + node + '/tasks',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken,
        'Cookie': this.ticket
      }
    }

    await axios(options)
    .then( res => {
      console.log(colors.blue('Note: ') + 'Recieved response from getNodeTasks().')
      data = res.data.data
    })
    .catch( err => {
      console.log(colors.red('Err: ') + err)
    })

    return data
  }

  async getNodeSubscription(node, param) {
    console.log(colors.blue('Note: ') + 'Executing getNodeSubscription()...')
    var data

    const options = {
      method: 'GET',
      params: param,
      url: this.apiUrl + '/nodes/' + node + '/subscription',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken,
        'Cookie': this.ticket
      }
    }

    await axios(options)
    .then( res => {
      console.log(colors.blue('Note: ') + 'Recieved response from getNodeSubscription().')
      data = res.data.data
    })
    .catch( err => {
      console.log(colors.red('Err: ') + err)
    })

    return data
  }

  async getNodeReport(node, param) {
    console.log(colors.blue('Note: ') + 'Executing getNodeReport()...')
    var data

    const options = {
      method: 'GET',
      params: param,
      url: this.apiUrl + '/nodes/' + node + '/report',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken,
        'Cookie': this.ticket
      }
    }

    await axios(options)
    .then( res => {
      console.log(colors.blue('Note: ') + 'Recieved response from getNodeReport().')
      data = res.data.data
    })
    .catch( err => {
      console.log(colors.red('Err: ') + err)
    })

    return data
  }

  async getNodeNetstat(node, param) {
    console.log(colors.blue('Note: ') + 'Executing getNodeNetstat()...')
    var data

    const options = {
      method: 'GET',
      params: param,
      url: this.apiUrl + '/nodes/' + node + '/netstat',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken,
        'Cookie': this.ticket
      }
    }

    await axios(options)
    .then( res => {
      console.log(colors.blue('Note: ') + 'Recieved response from getNodeNetstat().')
      data = res.data.data
    })
    .catch( err => {
      console.log(colors.red('Err: ') + err)
    })

    return data
  }

}

module.exports = pvea
