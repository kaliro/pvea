// pvea - proxmox api library for node.js
// libraries
const axios = require('axios');

pvea = {
  // Authentication function
  auth: function(host, user, pass) {
    // Proxmox API Domain
    var pmxApi = 'https://' + host + ':8006/api2/json';
    // Authentication URL
    var pmxAuth = 'username=' + user + '&password=' + pass;
    // Authentication Token
  },

  lxc: function(pmxNode, callback) {

    // lists LXC containers ( not tested =/ )
    axios({
      method: 'get',
      url: '/nodes/' + node + '/lxc',
      data: {
        node: pmxNode
      }

    })
  }

}

module.exports = pvea;
