// libraries
const axios = require('axios')
const colors = require('colors')
const qs = require('querystring')

// pvea module
class pvea {

  constructor(host, user, pass) {
    this.host = host
    this.user = user
    this.pass = pass
    this.apiUrl = `https://${  this.host  }:8006/api2/json`
    this.ticket = ''
    this.csrfToken = ''
    this.tokenTimeStamp = 0
    this.authenticated = false

  }

  async run(callback) {

    console.log(`${colors.blue('Note: ')  }Starting authentication process...`)

    const authUrl = `username=${  this.user  }&password=${  this.pass}`

    const options = {
      method: 'POST',
      data: authUrl,
      url: `${this.apiUrl  }/access/ticket`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    await axios(options)
      .then(res => {
        this.ticket = `PVEAuthCookie=${  res.data.data.ticket}`
        this.csrfToken = res.data.data.CSRFPreventionToken
        this.authenticated = true
        this.tokenTimeStamp = new Date().getTime()
      })
      .catch(err => {
        console.log(colors.red('Err: ') + err)
      })

    if (this.authenticated === true) {
      console.log(`${colors.blue('Note: ')  }Authentication successful!`)
    } else {
      console.log(`${colors.red('Err: ')  }Authentication failed.`)
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

    console.log(`${colors.blue('Note: ')  }Sending get request ${url}...`)
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
      .then(res => {
        console.log(`${colors.blue('Note: ')  }received response for ${url}.`)
        result = res.data.data
      })
      .catch(err => {
        result = err.response.status
        console.log(`${colors.red('Err: ') + err.response.status}: ${err.response.statusText}`)
      })

    return result;
  }

  async post(url, data) {

    // see if token expired, if so reauthenticate
    await this.authCheck()

    console.log(`${colors.blue('Note: ')}Sending post request ${url}...`)
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
      .then(res => {
        result = res
      })
      .catch(err => {
        result = err.response.status
        console.log(`${colors.red('Err: ') + err.response.status}: ${err.response.statusText}`)
      })

    return result;
  }

  async put(url, data) {

    // see if token expired, if so reauthenticate
    await this.authCheck()

    console.log(`${colors.blue('Note: ')}Sending put request ${url}...`)
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
      .then(res => {
        result = res
      })
      .catch(err => {
        result = err.response.status
        console.log(`${colors.red('Err: ') + err.response.status}: ${err.response.statusText}`)
      })

    return result;
  }

  async delete(url, data) {
    // see if token expired, if so reauthenticate
    await this.authCheck()

    console.log(`${colors.blue('Note: ')}Sending put request ${url}...`)
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
      .then(res => {
        result = res
      })
      .catch(err => {
        result = err.response.status
        console.log(`${colors.red('Err: ') + err.response.status}: ${err.response.statusText}`)
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
  async getStorageConfig(storage) {
    return await this.get(`/storage/${storage}`)
  }

  async deleteStorageConfig(storage) {
    return await this.delete(`/storage/${storage}`)
  }

  async updateStorageConfig(storage, param) {
    return await this.put(`/storage/${storage}`, param)
  }

  // pools
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/pools
  async getPools() {
    return await this.get('/pools')
  }

  // pools > {poolid}
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/pools/{poolid}
  async getPoolConfig(poolid) {
    return await this.get(`/pools/${poolid}`)
  }

  async deletePoolConfig(poolid) {
    return await this.delete(`/pools/${poolid}`)
  }

  async updatePoolConfig(poolid, param) {
    return await this.put(`/pools/${poolid}`, param)
  }

  // nodes
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes
  async getNodes() {
    return await this.get('/nodes')
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/wakeonlan
  async wakeNode(node) {
    return await this.post(`/nodes/${node}/wakeonlan`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/version
  async getNodeVersion(node) {
    return await this.get(`/nodes/${node}/version`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/time
  async getNodeTime(node) {
    return await this.get(`/nodes/${node}/time`)
  }

  async updateNodeTimeZone(node, param) {
    return await this.get(`/nodes/${node}/time`, param)
  }

  // https://pve.proxmo x.com/pve-docs/api-viewer/index.html#/nodes/{node}/syslog
  async getNodeLog(node, param) {
    return await this.get(`/nodes/${node}/syslog`, param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/subscription
  async getNodeSubscriptionStatus(node) {
    return await this.get(`/nodes/${node}/subscription`)
  }

  async deleteNodeSubscriptionKey(node) {
    return await this.delete(`/nodes/${node}/subscription`)
  }

  async setNodeSubscriptionKey(node) {
    return await this.put(`/nodes/${node}/subscription`)
  }

  async updateNodeSubscrpitionKey(node) {
    return await this.post(`/nodes/${node}/subscription`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/stopall
  async stopAll(node, param) {
    return await this.post(`/nodes/${node}/stopall`, param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/status
  async getNodeStatus(node) {
    return await this.get(`/nodes/${node}/status`)
  }

  async rebootNode(node) {
    return await this.post(`/nodes/${node}/status`, {
      command: 'reboot'
    })
  }

  async shutdownNode(node) {
    return await this.post(`/nodes/${node}/status`, {
      command: 'shutdown'
    })
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/startall
  async startAll(node, param) {
    return await this.post(`/nodes/${node}/startall`, param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/rrddata
  async getNodeRRDData(node) {
    return await this.get(`/nodes/${node}/rrddata`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/report
  async getNodeReport(node) {
    return await this.get(`/nodes/${node}/report`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/netstat
  async getNodeNetstat(node) {
    return await this.get(`/nodes/${node}/netstat`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/migrateall
  async migrateAll(node, param) {
    return await this.post(`/nodes/${node}/migrateall`, param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/journal
  async getNodeJournal(node) {
    return await this.get(`/nodes/${node}/journal`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/hosts
  async getNodeHostname(node) {
    return await this.get(`/nodes/${node}/hosts`)
  }

  async setNodeHostname(node) {
    return await this.post(`/nodes/${node}/hosts`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/dns
  async getNodeDnsSettings(node) {
    return await this.get(`/nodes/${node}/dns`)
  }

  async setNodeDnsSettings(node, param) {
    return await this.put(`/nodes/${node}/dns`, param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/cpu
  async listNodeCpu(node) {
    return await this.get(`/nodes/${node}/cpu`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/config
  async getNodeConfig(node) {
    return await this.get(`/nodes/${node}/config`)
  }

  async updateNodeConfig(node, param) {
    return await this.put(`/nodes/${node}/config`, param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/aplinfo
  async getNodeAplInfo(node) {
    return await this.get(`/nodes/${node}/aplinfo`)
  }

  // nodes > vzdump
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/vzdump
  async createBackup(node, param) {
    return await this.post(`/nodes/${node}/vzdump`, param)
  }

  async getBackupConfig(node, param) {
    return await this.get(`/nodes/${node}/vzdump/extractconfig`, param)
  }

  // node > tasks
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/tasks
  async getNodeTasks(node, param) {
    return await this.get(`/nodes/${node}/tasks`, param)
  }

  //https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/tasks/{upid}
  // No description on what this does on proxmox api docs, I will see later.
  async getNodeTaskNotDocumented(node, upid) {
    return await this.get(`/nodes/${node}/tasks/${upid}`)
  }

  async stopTask(node, upid) {
    return await this.delete(`/nodes/${node}/tasks/${upid}`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/tasks/{upid}/log
  async getTaskLog(node, upid, param) {
    return await this.get(`/nodes/${node}/tasks/${upid}/log`, param)
  }

  //https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/tasks/{upid}/status
  async getTaskStatus(node, upid) {
    return await this.get(`/nodes/${node}/tasks/${upid}/log`)
  }

  // node > storage
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/storage
  async getDatastoreStatus(node, param) {
    return await this.get(`/nodes/${node}/storage`, param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/storage/{storage}
  // No description on what this does on proxmox api docs, I will see later.
  async getDatastoreNotDocumented(node, storage) {
    return await this.get(`/nodes/${node}/storage/${storage}`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/storage/{storage}/status
  async getStorageStatus(node, storage) {
    return await this.get(`/nodes/${node}/storage/${storage}/status`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/storage/{storage}/rrddata
  async getStorageRRDData(node, storage, param) {
    return await this.get(`/nodes/${node}/storage/${storage}/rrddata`, param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/storage/{storage}/content
  async getStorageContent(node, storage, param) {
    return await this.get(`/nodes/${node}/storage/${storage}/content`, param)
  }

  async allocateDiskImage(node, storage, param) {
    return await this.post(`/nodes/${node}/storage/${storage}/content`, param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/storage/{storage}/content/{volume}
  async getVolumeAttributes(node, storage, volume, param) {
    return await this.get(`/nodes/${node}/storage/${storage}/content/${volume}`, param)
  }

  async deleteVolume(node, storage, volume, param) {
    return await this.delete(`/nodes/${node}/storage/${storage}/content/${volume}`, param)
  }

  // node > services
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/services/{service}/reload
  async reloadService(node, service) {
    return await this.post(`/nodes/${node}/services${service}/reload`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/services/{service}/restart
  async restartService(node, service) {
    return await this.post(`/nodes/${node}/services${service}/restart`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/services/{service}/start
  async startService(node, service) {
    return await this.post(`/nodes/${node}/services${service}/start`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/services/{service}/stop
  async stopService(node, service) {
    return await this.post(`/nodes/${node}/services${service}/stop`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/services/{service}/state
  async getServiceState(node, service) {
    return await this.get(`/nodes/${node}/services${service}/state`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/services
  async listServices(node) {
    return await this.get(`/nodes/${node}/services`)
  }

  // lxc containers
  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc
  async listLxcContainers(node) {
    return await this.get(`/nodes/${node}/lxc`)
  }

  async createLxcContainer(node, param) {
    return await this.post(`/nodes/${node}/lxc`, param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/template
  async createLxcTemplate(node, vmid) {
    return await this.post(`/nodes/${node}/lxc/${vmid}/template`)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/rrddata
  async getLxcRRDData(node, vmid, param) {
    return await this.post(`/nodes/${node}/lxc/${vmid}/rrddata`, param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/resize
  async resizeLxcContainer(node, vmid, param) {
    return await this.post(`/nodes/${node}/lxc/${vmid}/resize`, param)
  }

  // https://pve.proxmox.com/pve-docs/api-viewer/index.html#/nodes/{node}/lxc/{vmid}/pending
  async getLxcPending(node, vmid) {
    return await this.post(`/nodes/${node}/lxc/${vmid}/pending`)
  }

  async getLxcConfig(node, vmid) {
    return await this.post(`/nodes/${node}/lxc/${vmid}/config`)
  }

}

module.exports = pvea
