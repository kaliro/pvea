// pvea - proxmox api library for node.js
// libraries
const axios = require('axios');


 pvea = {
  auth: function(host, user, pass) {
    // Proxmox API Domain
    var pmxApi = 'https://' + host + ':8006/api2/json';
    // Authentication URL
    var pmxAuth = 'username=' + user + '&password=' + pass;
    // Authentication Token
    //test console.log();
    console.log(pmxAuth + pmxApi + host + user + pass);

  },
  test: function(msg) {
    // test console.log();
    console.log('Hello, ' + msg + '!');
  }
}

module.exports = pvea;
