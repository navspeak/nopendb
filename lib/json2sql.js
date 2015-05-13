//  Copyright 2015 © Progress Software
//  Contributor: Kumar Navneet
// Creates SQL from a Mongodb like Query and Projection

var _ = require('underscore');

module.exports = {
/**
* Creates a Select SQL
* @param {String} tablename      Name of the table.
* @param {JSONObject} list       Columns to be included in Select query 
*        e.g.  {c1 : 0, c2 :1} - include c1 & don't include c2
*              {} - include everything
* @param {JSONObject} whereJson  Query Projection to form the where clause
*        e.g.  { "$and" : [ { "CustNum" : 10  }, {"CustNum" : { "$lt" : 29 } } ] } ;
*              { "CustNum" : { "$lt" : 29 } } ;
*              { "CustNum" : 29  };
*              {}                     
*/
	 createSelectSQL  : function(tablename, list, whereJson) {
		var sql;
		if (_.isEmpty(list))
			sql = "SELECT * FROM PUB."+tablename; // TODO - remove hard coded PUB
		else
		{
			  var keys = Object.keys(list);
			  var col_list; 
			  for (var  i in keys) {
			  var key = keys[i];
			  if (list[key] == 0)
				continue;
			  if (col_list)
			   col_list = col_list + " , " + keys[i];
			  else
			   col_list = keys[i];
			  }
			sql = "SELECT " + col_list + " FROM PUB."+tablename + " " ;
		}
		
		var whereClause = createWhereClause(whereJson);
		if (whereClause)
			sql = sql + whereClause;
		return sql;
	}
}
var createWhereClause = function(json) 
{
	if (_.isEmpty(json))
		return "";
	var whereClause = " Where " ; 
	getKeyValue (json, function (keys, values) {
		for (var i in keys)
		{
			var key = keys[i];
			if (key.toUpperCase() == "$AND" || 	// if joined by $and, $or, $not (todo), $nor (todo)
			     key.toUpperCase() == "$OR")
			{
				var joiner = key.substring(1).toUpperCase(); // remove $ from $and
				var conditions = [];
				if(typeof values[i] =='object')
				{
					var array = values[i];
					for (item in array) {
					  conditions[conditions.length] = createCondition(array[item]);
					}
				}
				for (var i = 0; i < conditions.length; i++) {
					if ( (i+1) == conditions.length )
						whereClause = whereClause + " " + conditions[i] ;
					else
						whereClause = whereClause + " " + conditions[i] + " " + joiner;
				}
			}
			else // if it is a single json like { CustNum : 10 } or { CustNum : { $eq : 10 } } etc
			{
				whereClause = whereClause + " " + createCondition(json);
			}
		}
	})
	console.log(whereClause);
	return whereClause
}

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