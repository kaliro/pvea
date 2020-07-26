// libraries
const axios = require('axios')
const colors = require('colors')
const sleep = require('util').promisify(setTimeout)
const qs = require('querystring')

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

    if (callback) {
      await callback()
    }
  }

  async authCheck() {
    const currentTime = new Date().getTime()
    if (currentTime - this.tokenTimeStamp > 60 * 60 * 1000) {
      this.run()
    }
  }

  async get(url, param) {

    // see if token expired, if so reauthenticate
    await this.authCheck()

    console.log(colors.blue('Note: ') + 'Sending get request ' + url + '...')
    var result;

    const options = {
      method: 'GET',
      url: this.apiUrl + url,
      params: param,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken,
        'Cookie': this.ticket
      }
    }

    await axios(options)
    .then( res => {
      console.log(colors.blue('Note: ') + 'received response for ' + url + '.')
      result = res.data.data
    })
    .catch( err => {
      console.log(colors.red('Err: ') + err.response.status + ': ' + err.response.statusText)
    })

    return result;
  }

  async post(url, data) {

    // see if token expired, if so reauthenticate
    await this.authCheck()
    console.log(colors.blue('Note: ') + 'Sending post request ' + url + '...')
    var result;

    const options = {
      method: 'POST',
      url: this.apiUrl + url,
      data: qs.encode(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'CSRFPreventionToken': this.csrfToken,
        'Cookie': this.ticket
      }
    }

    await axios(options)
    .then( res => {
      result = res
    })
    .catch( err => {
      console.log(colors.red('Err: ') + err.response.status + ': ' + err.response.statusText)
    })

    return result;
  }

  async put() {
    // soon
  }

  async delete() {
    // soon
  }


  // core functionality
  async getVersion() {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/version
    return this.get('/version')
  }

  async getNodes() {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes
    return this.get('/nodes')
  }

  async getNodeVersion(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/version
    return this.get('/nodes/' + node + '/version')
  }

  async getNodeTime(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/time
    return this.get('/nodes/' + node + '/time')
  }

  async getNodeStatus(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/status
    return this.get('/nodes/' + node + '/status')
  }

  async getNodeLog(node, param) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/syslog
    return this.get('/nodes/' + node + '/syslog', param)
  }

  async getNodeTasks(node, param) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/tasks
    // probably not fully implemented =/ will do later.
    return this.get('/nodes/' + node + '/tasks', param)
  }

  async getNodeSubscription(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/subscription
    return this.get('/nodes/' + node + '/subscription')
  }

  async getNodeReport(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/report
    return this.get('/nodes/' + node + '/report')
  }

  async getNodeNetstat(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/netstat
    return this.get('/nodes/' + node + '/netstat')
  }

  async getNodeJournal(node, param) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/journal
    return this.get('/nodes/' + node + '/journal', param)
  }

  async getNodeHosts(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/hosts
    return this.get('/nodes/' + node + '/hosts')
  }

  async getNodeDNS(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/dns
    return this.get('/nodes/' + node + '/dns')
  }

  async getNodeConfig(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/config
    return this.get('/nodes/' + node + '/config')
  }

  async getNodeAplInfo(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/aplinfo
    return this.get('/nodes/' + node + '/aplinfo')
  }

  // lxc
  async createLxcContainer(node, param) {
    console.log(param)
    this.post('/nodes/' + node + '/lxc', param)
  }

}

module.exports = pvea
