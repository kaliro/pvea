// pvea - proxmox api library for node.js
// libraries
const axios = require('axios');

// log all requests - for development purposes.
axios.interceptors.request.use(request => {
  console.log('Starting Request', request)
  return request
})

axios.interceptors.response.use(response => {
  console.log('Response:', response)
  return response
})

// Authentication Token
var pmxAuthToken = {};
pmxAuthToken.CSRF = '';
pmxAuthToken.ticket = '';
pmxAuthToken.timeStamp = 0;

pvea = {
  // Authentication function
  auth: function(host, user, pass) {
    // Proxmox API Domain
    var pmxApi = 'https://' + host + ':8006/api2/json';
    // Authentication URL
    var pmxAuth = 'username=' + user + '&password=' + pass;
    // API URL
    var tmpTest = pmxApi + '/access/ticket'

    // post requests
    axios({
      method: 'post',
      url: pmxApi + '/access/ticket',
      data: pmxAuth // this will send variable pmxAuth to the server.
    })
    .then(response => {

      // save ticket
      pmxAuthToken.ticket = response.data.data.ticket;
      console.log('Note: Ticket saved. Value: ' + pmxAuthToken.ticket);
      // save CSRF token
      pmxAuthToken.CSRF = response.data.data.CSRFPreventionToken;
      console.log('Note: CSRF token saved. Value: ' + pmxAuthToken.CSRF);

    })
    .catch( error => { console.log(error)});



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
