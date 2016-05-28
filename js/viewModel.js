'use strict';
let ko = require('knockout');
let visualiserWindow = require('electron').remote.getCurrentWindow();
let ipc = require('ipc-renderer');

var noop = function(){};

var ViewModel = function ViewModel() {
    this.files = ko.observableArray([]);
    this.files.subscribe(this.listFiles.bind(this));

    this.playingSong = ko.observable(false);
    this.playingSong.subscribe(this.onPlay.bind(this));

    this.playProgress = ko.observable("0:00");
    this.playDuration = ko.observable("0:00");
    this.onPlayPause = noop;
    this.isPlaying = noop;

    this.dragging = ko.observable(false);
    this.searching = ko.observable(false);
    this.lastFoundFile = ko.observable(null);

    this.loadingSongContents = ko.observable(false);
    this.errorText = ko.observable();
    this.fileList = ko.observableArray([]);
    this.onFiles = noop;
    this.onRemoveFile = noop;

    this.pulloutVisible = ko.observable(true);

    ipc.on('file-search-results', this.onSearchFinished.bind(this));
    ipc.on('file-search-progress', this.onSearchProgress.bind(this));
};

ViewModel.prototype.onDrag = function(event) {
    this.reset();
    this.dragging(true);
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    return false;
};

ViewModel.prototype.onDrop = function(event) {
    event.preventDefault();
    var dtFiles = event.dataTransfer.files;
    var files = [];
    for (var i = 0; i < dtFiles.length; i++) {
        this.fileSearch(dtFiles[i]);
    }
    this.dragging(false);
    this.searching(true);
};

ViewModel.prototype.queueFileSearches = function(files) {
    this.fileSearch(files[0]).then(() => {
        if (files.length > 1) {
            this.queueFileSearches(files.slice(1));
        }
    });
};

ViewModel.prototype.fileSearch = function(file) {
    return new Promise((resolve, reject) => {
        ipc.send('file-search', file.path);
        ipc.once('file-search-results', () => resolve());
    });
};

ViewModel.prototype.onSearchFinished = function(event, results) {
    this.searching(false);
    this.lastFoundFile(null);
    this.files(this.files().concat(results));
    this.onFiles(results);
}

ViewModel.prototype.onSearchProgress = function(event, result) {
    this.lastFoundFile(result);
}

ViewModel.prototype.reset = function() {
    this.errorText("");
    this.dragging(false);
    this.loadingSongContents(false);
};

ViewModel.prototype.listFiles = function() {
    var fileNames = this.files().map(function(file) {
        var folderSeparated = file.split(/(\\|\/)/g);
        var dotSeperatedChunks = folderSeparated[folderSeparated.length - 1].split(".");
        var fileExtRemovedChunks = dotSeperatedChunks.slice(0, dotSeperatedChunks.length - 1);
        return fileExtRemovedChunks.join(".");
    });
    this.fileList(fileNames);
};

ViewModel.prototype.errorDecoding = function() {
    this.reset();
    this.errorText("There was an error decoding the file you dropped.");
};

ViewModel.prototype.togglePullout = function() {
    this.pulloutVisible(!this.pulloutVisible());
};

ViewModel.prototype.removeFile = function(i) {
    this.onRemoveFile(i());
};

ViewModel.prototype.onPlay = function(isPlaying) {
    if (isPlaying) {
        this.pulloutVisible(false);
    }
};

ViewModel.prototype.setProgress = function(progress) {
    this.playProgress(timeFormat(progress));
};

ViewModel.prototype.setDuration = function(time) {
    this.playDuration(timeFormat(time));
};

ViewModel.prototype.playPause = function() {
    this.onPlayPause();
    this.playingSong(this.isPlaying());
};

ViewModel.prototype.minimise = function() {
    visualiserWindow.minimize();
}

ViewModel.prototype.maximise = function() {
    if (!visualiserWindow.isMaximized()) {
        visualiserWindow.maximize();
    } else {
        visualiserWindow.restore();
    }
}

ViewModel.prototype.close = function() {
    visualiserWindow.close();
}

module.exports = new ViewModel();

function timeFormat(s) {
    var seconds = Math.floor(s % 60);
    var formattedSeconds = (seconds < 10) ? ("0" + seconds) : seconds;
    var minutes = Math.floor(s / 60);
    return minutes + ":" + formattedSeconds;
}
