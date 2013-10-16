/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var url = require("url");
var qs = require("querystring");
var util = require('util');
var http = require("http");

var messages = {messages: []
// {"username":"anonymous",
// "text":"My name is Emma and i HATE BREAD SO MUCH",
// "roomname":"lobby",
// "createdAt":"2013-10-14T23:07:06.924Z",
// "updatedAt":"2013-10-14T23:07:06.924Z",
// "objectId":"zLoL5bpSVP"}
};

var idCounter = 0;

var msgsPath = '/classes/messages';
//var msgsDomain = 'http://127.0.0.1:8080';

//populate messages here

exports.handleRequest = function(request, response) {

  if(request.method === 'POST'){
    console.log("Serving request type " + request.method + " for url " + request.url);
  }

  var requestType = request.method;
  var pathname = url.parse(request.url).pathname;
  var querystring = qs.parse(url.parse(request.url).query);

  // console.log(' ');
  // console.log(requestType);
  // console.log(pathname);
  // console.log(querystring);

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

    var headers = defaultCorsHeaders;
    var pathWords = pathname.slice(1).split('/');
    var pathStart = pathWords[0];
    var roomName = pathWords[1];
    var stringifiedMsg = '';

  if(requestType === 'OPTIONS'){
    // headers['Content-Type'] = "application/javascript";
    // headers['Content-Length'] = querystring.length;
    response.writeHead(200, headers);
    response.end();
  }

  console.log('before');
  console.log('request type: ', requestType);
  console.log('pathStart: ', pathStart);

  if(requestType === 'GET' && pathStart === 'classes'){
    console.log('after');
    if(messages[roomName] === undefined){
      stringifiedMsg = JSON.stringify({results: []});
    }else{
      stringifiedMsg = JSON.stringify({results: messages[roomName]});
    }
    response.writeHead(200, headers);
    response.end(stringifiedMsg);
  }else if(requestType === 'POST' && pathStart === 'classes' && roomName){  // the final condition filters pathnames with no roomName, or an empty string
    console.log("[201] " + requestType + " to " + pathname);
    var fullBody = '';

    request.on('data', function(chunk) {
      // append the current chunk of data to the fullBody variable
      fullBody += chunk;
    });
    request.on('end', function() {
    // response ended -> do something with the data
      response.writeHead(201, headers);//{'Content-Type': 'text/html'});
      // parse the received body data

      console.log("Before parsing: ", fullBody);
      var decodedBody = JSON.parse(fullBody);
      console.log("After parsing: ", decodedBody);

      // { username: 'Ket', text: 'Michael meditates', roomname: 'lobby' }
      // to 
      // {"username":"anonymous",
      // "text":"My name is Emma and i HATE BREAD SO MUCH",
      // "roomname":"lobby",
      // "createdAt":"2013-10-14T23:07:06.924Z",
      // "updatedAt":"2013-10-14T23:07:06.924Z",
      // "objectId":"zLoL5bpSVP"}

      //Tue Oct 15 2013 15:50:14 GMT-0700 (PDT)

      decodedBody.objectId = idCounter;
      var date = JSON.parse(JSON.stringify(new Date()));
      decodedBody.createdAt = date;
      decodedBody.updatedAt = date;
      idCounter++;

      if(messages[roomName] === undefined){
        messages[roomName] = [];
      }

      messages[roomName].push(decodedBody);

      //messages.push(decodedBody);
      console.log(messages);
      // output the decoded data to the HTTP response
      response.end();
    });
  } else {
    response.writeHead(404, headers);
    response.end();
  }
};


