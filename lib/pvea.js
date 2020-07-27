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

  async put(url, data) {

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

  async delete(url, data) {
    // see if token expired, if so reauthenticate
    await this.authCheck()

    console.log(colors.blue('Note: ') + 'Sending put request ' + url + '...')
    var result;

    const options = {
      method: 'DELETE',
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

  // version
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/version
  async apiVersion() {
    return await this.get('/version')
  }

  // storage
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/storage
  async getStorage(param) {
    return await this.get('/storage', param)
  }

  async createStorage(param) {
    return await this.post('/storage', param)
  }

  // storage > {storage}
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/storage/{storage}
  async getStorageConfig(param) {
    return await this.get('/storage/' + param.storage)
  }

  async deleteStorageConfig(param) {
    return await this.delete('/storage/' + param.storage)
  }

  async updateStorageConfig(param) {
    return await this.put('/storage/' + param.storage, param)
  }

  // pools
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/pools
  async getPools() {
    return await this.get('/pools')
  }

  // pools > {poolid}
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/pools/{poolid}
  async getPoolConfig(param) {
    return await this.get('/pools/' + param.poolid)
  }

  async deletePoolConfig(param) {
    return await this.delete('/pools/' + param.poolid)
  }

  async updatePoolConfiig(param) {
    return await this.put('/pools/' + param.poolid, param)
  }

  // nodes
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes
  async getNodes(param) {
    return await this.get('/nodes')
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/wakeonlan
  async wakeNode(param) {
    return await this.post('/nodes/' + param.node + '/wakeonlan')
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/version
  async getNodeVersion(param) {
    return await this.get('/nodes/' + param.node + '/version')
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/time
  async getNodeTime(param) {
    return await this.get('/nodes/' + param.node + '/time')
  }

  async updateNodeTimeZone(param) {
    return await this.get('/nodes/' + param.node + '/time', param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/syslog
  async getNodeLog(param) {
    return await this.get('/nodes/' + param.node + '/syslog', param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/subscription
  async getNodeSubscriptionStatus(param) {
    return await this.get('/nodes/' + param.node + '/subscription')
  }

  async deleteNodeSubscriptionKey(param) {
    return await this.delete('/nodes/' + param.node + '/subscription')
  }

  async setNodeSubscriptionKey(param) {
    return await this.put('/nodes/' + param.node + '/subscription')
  }

  async updateNodeSubscrpitionKey(param) {
    return await this.post('/nodes/' + param.node + '/subscription')
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/stopall
  async stopAll(param) {
    return await this.post('/nodes/' + param.node + '/stopall', param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/status
  async getNodeStatus(param) {
    return await this.get('/nodes/' + param.node + '/status')
  }

  async rebootNode(param) {
    return await this.post('/nodes/' + param.node + '/status', { command: 'reboot' })
  }

  async shutdownNode(node, param) {
    return await this.post('/nodes/' + param.node + '/status', { command: 'shutdown' })
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/startall
  async startAll(param) {
    return await this.post('/nodes/' + param.node + '/startall', param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/rrddata
  async getNodeRrdData(param) {
    return await this.get('/nodes/' + param.node + '/rrddata')
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/report
  async getNodeReport(param) {
    return await this.get('/nodes/' + param.node + '/report')
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/netstat
  async getNodeNetstat(param) {
    return await this.get('/nodes/' + param.node + '/netstat')
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/migrateall
  async migrateAll(param) {
    return await this.post('/nodes/' + param.node + '/migrateall', param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/journal
  async getNodeJournal(param) {
    return await this.get('/nodes/' + param.node + '/journal')
  }
}

module.exports = pvea
