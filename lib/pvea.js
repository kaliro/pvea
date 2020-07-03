// pvea - proxmox api library for node.js
// libraries
const axios = require('axios');

module.exports = function(user, pass, host) {

  // Proxmox API Domain
  var pmxApi = 'https://' + host + ':8006/api2/json';
  // Authentication 
  var prxAuth = 'username=' + user + '&password=' + pass;

}
