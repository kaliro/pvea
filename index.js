// pvea example file
const pveajs = require('./lib/pvea.js');

// format: domain, username@authtype, password.
// example: proxmox.example.org, admin@pve, hunter2.
const pvea = new pveajs('xxx', 'xxx@pve', 'xxx')

async function main() {

  pvea.getVersion().then( res => {
    console.log(res)
  })

}

pvea.run(main)
