// pvea test files
var pvea = require('./lib/pvea.js');

// format: domain, username@authtype, password.
// example: proxmox.example.org, admin@pve, hunter2.
console.log(pvea.auth('xxx','xxx','xxx'));
