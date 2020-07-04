// pvea - proxmox api library for node.js
// libraries
const axios = require('axios');

axios.defaults.withCredentials = true

// log all requests - for development purposes.
axios.interceptors.request.use(request => {
  console.log('Starting Request', request)
  return request
})

axios.interceptors.response.use(response => {
  console.log('Response:', response)
  return response
})

// peava module
module.exports = function(host, user, pass) {

  // proxmox related information.

  pmx = {};
  pmx.authTokenCSRF = '';
  pmx.authTokenTicket = '';
  pmx.authTokenTimeStamp = 0;
  pmx.apiURL = 'https://' + host + ':8006/api2/json';
  pmx.authURL = 'username=' + user + '&password=' + pass;

  // authentication function
  function auth() {

    axios({
      method: 'post',
      withCredentials: true,
      url: pmx.apiURL + '/access/ticket',
      data: pmx.authURL
    })
    .then( res => {
      console.log(res);
      pmx.authTokenCSRF = res.data.data.CSRFPreventionToken;
      pmx.authTokenTicket = res.data.data.ticket;
    })
    .catch( err => {
      console.log(err)
    })

  }

  // go through authentication process
  auth()

  return {
    version: function() {
      axios({
        method: 'get',
        withCredentials: true,
        headers: {Cookie: 'PVEAuthCookie=' + pmx.authTokenTicket + ';'},
        url: pmx.apiURL + '/version'
      })
      .then( res => {
        console.log(res)
      })
      .catch( err => {
        console.log(err)
      })
    },
    helloWorld: function(){
      console.log('Hello, world!')
    }
  }
}
