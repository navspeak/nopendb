// Copyright 2015 © Progress Software
// Contributor: Kumar Navneet
// Module to perform CRUD operations on OE database
 
 
var config = require('./config.json');
var assert = require("assert");
var db =  require('odbc')();
var json2sql = require("./json2sql.js");

function nopendb() {
  this._conn = "DSN=" + config.dsn + ";UID=" + config.username+ ";PWD=" + config.password +";DATABASE=" + config.dbname;;
}

/**
* Opens a database connection            
*/
nopendb.prototype.opendb = function(callback) {
	try {
	  cn = this._conn;
	  var result = db.openSync(cn);
	  assert(result, true);
	  if (result) {
		return callback(null,db);
		}
	}
	catch (e) {
	 assert(e, null);
	 return callback(e,null);
	}
}

/**
* closes a database connection            
*/
nopendb.prototype.closedb = function(callback) {
	try {
	  var result = db.closeSync();
	  assert(result, true);
	  if (result) {
		return callback(null,db);
		}
	}
	catch (e) {
	 assert(e, null);
	 return callback(e,null);
	}
}

/**
* Finds all records in a table            
*/
nopendb.prototype.findAll = function(db, tablename, callback) {
    var sql; 
	sql = "SELECT * FROM PUB."+tablename;
	try {
		var rows = db.querySync(sql);
		return callback(null, rows);
	}
	catch (e) {
	 assert(e, null);
	 return callback(e,null);
	}
}

/**
* Finds records in a table based on a where clause            
*/
nopendb.prototype.findSome = function(db, tablename, list, whereJson, callback) {
	var sql = json2sql.createSelectSQL(tablename, list, whereJson);
	try {
		var rows = db.querySync(sql);
		return callback(null, rows);
	}
	catch (e) {
	 assert(e, null);
	 return callback(e,null);
	}
}

/* private methods */
var getKeyValue = function(json, callback) {
	var keys = Object.keys(json);
	var values = [];
	for (var i in keys)
	{
		var key = keys[i];
		values[i] = json[key];
	}
	return callback(keys, values)	
}

var getOperatorPart = function(json) {
	var keys = Object.keys(json);
	var op = keys[0];
	var operator ;
	if (op == "$lt")
		operator = "<";
	if (op == "$lte")
		operator = "<=";
	if (op == "$gt")
		operator = ">";
	if (op == "$gte")
		operator = ">=";
	if (op == "$eq")
		operator = "=";							
	var cond = operator + " " + json[op];
	return cond;
}

var createCondition = function(json) {
	  for (subItem in json) {
		 cond = subItem;
		 if (typeof json[subItem] == 'object')
		 {
			cond = cond + " " + getOperatorPart(json[subItem]);
		 }
		 else
		 {
			cond = cond + " = " + json[subItem];
		 }
		 return cond
	  }
}


module.exports = nopendb;