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

  pvea.getNodeVersion('rbx-01').then( res => {
    console.log(res)
  })

  pvea.getNodeTime('rbx-01').then( res => {
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

}

pvea.run(main)
