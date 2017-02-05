var fs = require('fs');
var http = require('http');
var querystring = require('querystring');
var htmlparser = require('htmlparser');
var select = require('soupselect').select;

var getName = function(csv) {
  var name = csv.split(',').map(function(n) { return n.toLowerCase()});
  return name[1] + ' ' + name[0];
};

var makeRequest = function(name) {
  // Build the post string from an object
  var post_data = querystring.stringify({
    'querytype': 'person',
    'loc': 'ucla',
    'searchtype': 'advanced',
    'group': 'student',
    'cn': getName(name)
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: 'www.directory.ucla.edu',
      path: '/search.php',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      var data = '';
      res.on('data', function (chunk) {
          data += chunk;
      });
      res.on('end', function() {
        getEmail(data, name);
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();
};

var getEmail = function(html, name) {
  var handler = new htmlparser.DefaultHandler(function(err, dom) {
    if(err) throw err;
    var a_tags = select(dom, '.element-leftbar a');
    var hrefs = a_tags.map(function(a) { return a.attribs.href });
    var emails = hrefs.map(function(href) { return href.split(':')[1] });
    var output = name;
    emails.forEach(function(email) {
      var res = decodeURI(email).replace('%40', '@')
      output += '\t' + res;
      console.error(res);
    });
    console.log(output);
  });
  var parser = new htmlparser.Parser(handler);
  parser.parseComplete(html);
};

var counter = 0;
var interval = 5392;
var timer;

fs.readFile('2018.csv', function(err, data) {
  if(err) throw err;
  var names = data.toString().split('\n');
  names.pop(); // extra newline
  /*names.forEach(function(name) {
    makeRequest(name);
  });
  */
  //names = names.slice(0, 5);
  timer = setInterval(function() {
    if(names[counter] == '') {
      counter++;
      return;
    }

    console.error('requesting: ' + names[counter]);

    makeRequest(names[counter]);
    counter++;
    if (counter >= names.length)
      clearInterval(timer);
  }, interval);
});
