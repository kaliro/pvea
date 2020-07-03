// pvea test files
var pvea = require('./lib/pvea.js');

pvea.test('a');

pvea.auth('example.com','user','pass');

console.log(pvea.pmxTokenTime)
