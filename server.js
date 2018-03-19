// content of index.js
const http = require('http')
var url = require('url');
var path = require('path');
var fs = require('fs');
const port = 3000

const requestHandler = (request, response) => {
    var requestUrl = url.parse(request.url);
    var fsPath, contentType;
    var content = {'.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon'};

    if (requestUrl.pathname === '/') {
        fsPath = path.resolve(__dirname + '/index.html');
        contentType = {'Content-Type': 'text/html'};
    } else {
        fsPath = path.resolve(__dirname + requestUrl.pathname);
        contentType = {'Content-Type': content[path.extname(requestUrl.pathname)]};
    }

    console.log(request.url, contentType);

    fs.stat(fsPath, function (err, stat) {
        if (err) {
            return end(request, response);
        }

        try {
            if (stat.isFile()) {
                response.writeHead(200, contentType);
                fs.createReadStream(fsPath).pipe(response);
            }
            else {
                response.writeHead(500);
                end(request.res);
            }
        }
        catch(e) {
            end(request, response);
        }
    });
}

function end(request, response) {
    response.end();
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
});