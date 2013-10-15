/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var url = require("url");
var qs = require("querystring");
var util = require('util');

var messages = [
{"username":"anonymous",
"text":"My name is Emma and i HATE BREAD SO MUCH",
"roomname":"lobby",
"createdAt":"2013-10-14T23:07:06.924Z",
"updatedAt":"2013-10-14T23:07:06.924Z",
"objectId":"zLoL5bpSVP"}
];
var http = require("http");
//populate messages here

exports.handleRequest = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var requestType = request.method;
  var pathname = url.parse(request.url).pathname;
  var querystring = qs.parse(url.parse(request.url).query);

  console.log(' ');
  console.log(requestType);
  console.log(pathname);
  console.log(querystring); 

  route(requestType, pathname, querystring, request, response);

};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var route = function(requestType, pathname, querystring, request, response){

    console.log('querystring: ', querystring);  
    console.log("requestType: ", requestType);

    var statusCode = 200;
    var headers = defaultCorsHeaders;

  if(requestType === 'OPTIONS'){
    // headers['Content-Type'] = "application/javascript";
    // headers['Content-Length'] = querystring.length;
    response.writeHead(statusCode, headers);
    response.end();
  }

  if(pathname === '/1/classes/chatterbox' && requestType === 'GET'){
    var stringifiedMsg = JSON.stringify({results: messages});
    response.writeHead(statusCode, headers);
    response.end(stringifiedMsg);
  }else if(requestType === 'POST'){
    console.log("[200] " + requestType + " to " + pathname);
    var fullBody = '';
    
    request.on('data', function(chunk) {
      // append the current chunk of data to the fullBody variable
      fullBody += chunk.toString();
    });
    
    request.on('end', function() {
    
      // response ended -> do something with the data
      response.writeHead(200, headers);//{'Content-Type': 'text/html'});
      
      // parse the received body data
      console.log("Before parsing: ", fullBody);
      var decodedBody = qs.parse(fullBody);
      console.log("After parsing: ", decodedBody);

      // output the decoded data to the HTTP response
      response.write('<html><head><title>Post data</title></head><body><pre>');
      response.write(util.inspect(decodedBody));
      response.write('</pre></body></html>');
      response.end();
    });
  }

};
