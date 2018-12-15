const fs = require('fs')
	, events = require('events')
	, util = require('util')
	, watchDir = './watch'
	, processDir = './done';

class Watcher extends events.EventEmitter {
	constructor(watchDir, processDir) {
		super();
		this.watchDir = watchDir;
		this.processDir = processDir;
	}
	watch() {
		var watcher = this;
		fs.readdir(this.watchDir, function (err, files) {
			if(err) throw err;
			for(let index in files) {
				watcher.emit('process', files[index]);
			}
		})
	}
	start() {
		var watcher = this;
		fs.watchFile(this.watchDir, function () {
			watcher.watch();
		})
	}
}

var watcher = new Watcher(watchDir, processDir)

watcher.on('process', function (file) {
	var watchFile = this.watchDir + '/' + file;
	var processFile = this.processDir + '/' + file.toLowerCase();
	fs.rename(watchFile, processFile, function (err) {
		if(err) throw err;
	})
});

watcher.start();