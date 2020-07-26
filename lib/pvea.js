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
      result = err.response.status
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
      result = err.response.status
      console.log(colors.red('Err: ') + err.response.status + ': ' + err.response.statusText)
    })

    return result;
  }

  async put() {

        // see if token expired, if so reauthenticate
        await this.authCheck()

        console.log(colors.blue('Note: ') + 'Sending put request ' + url + '...')
        var result;

        const options = {
          method: 'PUT',
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
          result = err.response.status
          console.log(colors.red('Err: ') + err.response.status + ': ' + err.response.statusText)
        })

        return result;
  }

  async delete() {
    // soon
  }

  // coding in node.js atm. writing a library that interacts with an api.

  // core functionality
  async getVersion() {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/version
    return this.get('/version')
  }

  async getNodes() {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes
    return await this.get('/nodes')
  }

  async getNodeVersion(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/version
    return await this.get('/nodes/' + node + '/version')
  }

  async getNodeTime(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/time
    return await this.get('/nodes/' + node + '/time')
  }

  async getNodeStatus(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/status
    return await this.get('/nodes/' + node + '/status')
  }

  async getNodeLog(node, param) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/syslog
    return await this.get('/nodes/' + node + '/syslog', param)
  }

  async getNodeTasks(node, param) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/tasks
    // probably not fully implemented =/ will do later.
    return await this.get('/nodes/' + node + '/tasks', param)
  }

  async getNodeSubscription(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/subscription
    return await this.get('/nodes/' + node + '/subscription')
  }

  async getNodeReport(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/report
    return await this.get('/nodes/' + node + '/report')
  }

  async getNodeNetstat(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/netstat
    return await this.get('/nodes/' + node + '/netstat')
  }

  async getNodeJournal(node, param) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/journal
    return await this.get('/nodes/' + node + '/journal', param)
  }

  async getNodeHosts(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/hosts
    return await this.get('/nodes/' + node + '/hosts')
  }

  async getNodeDNS(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/dns
    return await this.get('/nodes/' + node + '/dns')
  }

  async getNodeConfig(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/config
    return await this.get('/nodes/' + node + '/config')
  }

  async getNodeAplInfo(node) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/aplinfo
    return await this.get('/nodes/' + node + '/aplinfo')
  }

  // LXC functionality.

  async getLxcContainerStatus(node, vmid) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/status/current
    return await this.get('/nodes/' + node + '/lxc/' + vmid + '/status/current')
  }

  async getLxcContainerConfig(node, vmid) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/config
    return await this.get('/nodes/' + node + '/lxc/' + vmid + '/status/config')
  }

  async getLxcContainerFeatures(node, vmid, feature) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/feature
    return await this.get('nodes' + node + '/lxc/' + vmid + 'feature', feature)
  }

  async getLxcContainerPendingStatus(node, vmid) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/pending
    return await this.get('nodes' + node + '/lxc/' + vmid + 'pending')
  }

  async migrateLxcContainer(node, vmid, param) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/migrate
    return await this.post('/nodes/' + node + '/lxc/' + vmid + '/migrate', param)
  }

  async cloneLxcContainer(node, vmid, param) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/clone
    return await this.post('/nodes/' + node + '/lxc/' + vmid + '/clone', param)
  }

  async createLxcContainer(node, param) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc
    return await this.post('/nodes/' + node + '/lxc', param)
  }

  async createLxcContainerTemplate(node, vmid) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/template
    return await this.post('/nodes/' + node + '/lxc/' + vmid + '/template')
  }


  async startLxcContainer(node, vmid) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/status/start
    return await this.post('/nodes/' + node + '/lxc/' + vmid + '/status/start')
  }

  async stopLxcContainer(node, vmid) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/status/stop
    return await this.post('/nodes/' + node + '/lxc/' + vmid + '/status/stop')
  }

  async shutdownLxcContainer(node, vmid) {
    // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/status/shutdown
    return await this.post('/nodes/' + node + '/lxc/' + vmid + '/status/shutdown')
  }

}

module.exports = pvea
