var json2sql = require("./lib/json2sql.js");

var tablename = "customer";
var list = { "CustNum" : 1 , "Country" : 1, "Address" : 1};
//var list = { };
var whereJson ={ "$and" : [ { "CustNum" : 10  }, {"CustNum" : { "$lt" : 29 } } ] } ;
//var whereJson ={ "CustNum" : { "$lt" : 29 } } ;
//var whereJson = { "CustNum" : 29  };
//var whereJson = {};
var sql = json2sql.createSelectSQL(tablename, list, whereJson);
console.log(sql);