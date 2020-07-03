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

    global var a = "a"
    // Authentication Token Expiry Checker
    // Expires after two hours.

    //test console.log();
    console.log(pmxAuth + pmxApi + host + user + pass);

  },
  test: function(msg) {
    // test console.log();
    // var d = new Date();
    // var currenthour = d.getHours()
    // var newhour = 11
    //
    // console.log('Hello, ' + msg + '!' + currenthour);
    //
    // if (currenthour === newhour || currenthour === newhour - 1 || currenthour === newhour - 2 ) {
    //   console.log('true');
    //         console.log(newhour + " " + currenthour)
    // } else {
    //   console.log('false');
    //   console.log(newhour + currenthour)
    // }
  }
}

module.exports = pvea;
