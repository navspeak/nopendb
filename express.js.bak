var nopendb = new ( require('./lib/nopendb.js') );
var app = require('express')();
var bodyParser = require('body-parser');
var http = require("http");
var url = require("url");
var morgan = require('morgan');
var assert = require("assert");
var db;

//Read
// GET /nodeopenedge/customers?filter=CustNum>10&top=5
app.get('/nodeopenedge/:table', function(req, res) {
	var pathname = url.parse(req.url).pathname;
	var query = require('url').parse(req.url,true).query;
	console.log(query);
	var list = { "CustNum" : 1 , "Country" : 1};
	var whereJson ={ "$and" : [ { "CustNum" : { $gt : 10 }  }, {"CustNum" : { "$lt" : 29 } } ] } ;
	/*var whereJson ={ "CustNum" : { "$lt" : 29 } } ;
	var whereJson = { "CustNum" : 29  };
	var whereJson = {};*/
    nopendb.findSome(db, req.params.table, list, whereJson, function(err, rows) {
	if (res)
		{
			res.type('application/json'); // set content-type
			res.send(rows);
		}
  })
});

// Server init
var server = app.listen(process.env.PORT || 4731, function(){
	nopendb.opendb(function(err, res) {
		assert.equal(err, null);
		if (res)
		  {
				db = res;
				console.log("Connection opened successfully");
		  }
	})

	if (process.env.PORT)
	 console.log("Server listening at " + process.env.PORT );
	else
	 console.log("Server listening at " + 4731 );
});