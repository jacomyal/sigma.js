/**
 * Type 'node server.js' to run a basic HTTP server.
 *
 * License:
 * --------
 * Copyright © 2014 Sébastien Heymann
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * The Software is provided "as is", without warranty of any kind, express or
 * implied, including but not limited to the warranties of merchantability,
 * fitness for a particular purpose and noninfringement. In no event shall the
 * authors or copyright holders be liable for any claim, damages or other
 * liability, whether in an action of contract, tort or otherwise, arising
 * from, out of or in connection with the software or the use or other dealings
 * in the Software.
 */

/**
 * Module dependencies.
 */
var http = require('http')
  , path = require("path")
  , url = require("url")
  , fs = require('fs');

var PORT=8080;

http.createServer(function (req, res) {
  var my_path = url.parse(req.url).pathname;  
      var full_path = path.join(process.cwd(),my_path);  
      fs.exists(full_path,function(exists){  
          if(!exists || fs.lstatSync(full_path).isDirectory()) {  
              res.writeHeader(404, {"Content-Type": "text/plain"});    
              res.write("404 Not Found\n");    
              res.end();  
          }  
          else {  
              fs.readFile(full_path, "binary", function(err, file) {    
                   if(err) {    
                       res.writeHeader(500, {"Content-Type": "text/plain"});    
                       res.write(err + "\n");    
                       res.end();    
                   
                   }    
                   else {  
                      res.writeHeader(200);    
                      res.write(file, "binary");    
                      res.end();  
                  }   
              });  
          }  
      });
}).listen(PORT);
console.log("Server listening on port", PORT);