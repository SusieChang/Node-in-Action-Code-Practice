const http = require('http');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = 8080;

var cache = {};

function sendNotFound (res) {
	res.writeHeader(404, {'Content-Type':'text/plain'});
	res.write('Error 404: resource not found');
	res.end();
};

function sendFile (res, filepath, filecontent) {
	res.writeHeader(200, {
		'Content-Type': mime.lookup(path.basename(filepath))
	});
	res.end(filecontent);
}

function sendStatic (res, cache, path) {
	if(cache && cache[path]) {
		sendFile(res, path, cache[path]);
	} else {
		try {
			fs.readFile(path, (err, data) => {
				if(err) {
					sendNotFound(res);
					return;
				} else {
					cache[path] = data;
					sendFile(res, path, data);
				}
			})
		} catch(e) {
			sendNotFound(res);
			console.log(e);
		}
	}
}


const server = http.createServer((req, res) => {
	let filepath = "";
	if(req.url == '/') {
		filepath = 'public/index.html'
	} else {
		filepath = 'public' + req.url;
	}
	let abspath = './' + filepath;
	sendStatic(res, cache, abspath);
})

server.listen(PORT, HOST, () => {
	console.log(`Server running at http://${HOST}:${PORT}/`);
});