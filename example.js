// pvea example file
const pveajs = require('./lib/pvea.js');

// format: domain, username@authtype, password.
// example: proxmox.example.org, admin@pve, hunter2.
const pvea = new pveajs('xxx', 'xxx@pve', 'xxx')

async function main() {

  pvea.getVersion().then( res => {
    console.log(res)
  })

  pvea.getNodes().then( res => {
    console.log(res)
  })

  pvea.getNodeVersion('xxx').then( res => {
    console.log(res)
  })

  pvea.getNodeTime('xxx').then( res => {
    console.log(res)
  })

  pvea.getNodeLog('xxx', { limit: '3', since: '2020-07-07' }).then( res => {
    console.log(res)
  })

  pvea.getNodeTasks('xxx', { limit: '3', vmid: '106' }).then( res => {
    console.log(res)
  })

  pvea.getNodeStatus('xxx').then( res => {
    console.log(res)
  })

  pvea.getNodeSubscription('xxx').then( res => {
    console.log(res)
  })

  pvea.getNodeReport('xxx').then( res => {
    console.log(res)
  })

  pvea.getNodeNetstat('xxx').then( res => {
    console.log(res)
  })

  pvea.createLxcContainer(node, {
    vmid: 107,
    hostname: 'test',
    password: 'secret',
    ostemplate: 'storage:vztmpl/debian-10.0-standard_10.0-1_amd64.tar.gz',
    memory: 512,
    swap: 512,
    storage: 'containers'
  })

  // more examples to come

}

pvea.run(main)
