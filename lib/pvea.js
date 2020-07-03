// pvea - proxmox api library for node.js
// libraries
const axios = require('axios');

pvea = {
  // Authentication function
  auth: function(host, user, pass) {
    // Proxmox API Domain
    var pmxApi = 'https://' + host + ':8006/api2/json';
    // Authentication Token
    var pmxAuthToken = {};
    pmxAuthToken.CSRF = '';
    pmxAuthToken.PVEAuth = '';
    pmxAuthToken.timeStamp = 0;
    // Authentication URL
    var pmxAuth = 'username=' + user + '&password=' + pass;

    var tmpTest = pmxApi + '/access/ticket'

    console.log(tmpTest);

    axios({
      method: 'get',
      url: pmxApi + 'access/ticket',
      data: {
        username: user,
        password: pass
      }
    }).catch( error => { console.log(error)});



  },

  lxc: function(pmxNode, callback) {

    // lists LXC containers ( not tested =/ )
    axios({
      method: 'get',
      url: '/nodes/' + node + '/lxc',
      data: {
        node: pmxNode
      }

    });
  }

}

module.exports = pvea;
