var path = require('path');
var fs = require('fs');
var lib = path.join(path.dirname(fs.realpathSync(__filename)), '/lib/');
console.log(lib);
module.exports = require(lib+'nopendb.js');