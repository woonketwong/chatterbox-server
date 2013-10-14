/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */
var url = require("url");
var querystring = require("querystring");

var http = require("http");

var handleRequest = function(request, response) {
	console.log(request.url)
  var pathname = url.parse(request.url).pathname;
  var keyValueString = url.parse(request.url).query;
  var keyValueObject = querystring.parse(keyValueString);
  console.log('here ', keyValueObject);
  //var queryString = url.querystring.parse(url.parse(request.url).query);
  console.log("Request for " + pathname + " received.");
  console.log("Query Strings: " + keyValueObject + " received.");
  
    //route(pathname);

};

var route = function(pathname){

}


exports.handleRequest = handleRequest;


// querystring.parse('foo=bar&baz=qux&baz=quux&corge')
// // returns
// { foo: 'bar', baz: ['qux', 'quux'], corge: '' }



//                        url.parse(string).query
//                                            |
//            url.parse(string).pathname      |
//                        |                   |
//                        |                   |
//                      ------ -------------------
// http://localhost:8888/start?foo=bar&hello=world
//                                 ---       -----
//                                  |          |
//                                  |          |
//               querystring(string)["foo"]    |
//                                             |
//                          querystring(string)["hello"]