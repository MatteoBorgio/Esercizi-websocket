var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
console.log("port number: 3000");
    res.writeHead(200, {'Content-Type': 'audio/mp3'});
    fs.exists('song.mp3',function(exists) {
       if(exists) {
          var rstream = fs.createReadStream('song.mp3');
          rstream.pipe(res);
       } else {
          res.end('404');
       }
       
    });
}).listen(3000);

