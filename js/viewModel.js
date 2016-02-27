'use strict';
let ko = require('knockout');

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
    this.loadingSongContents = ko.observable(false);
    this.errorText = ko.observable();
    this.fileList = ko.observableArray([]);
    this.onFiles = noop;
    this.onRemoveFile = noop;

    this.pulloutVisible = ko.observable(true);
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
        files.push(dtFiles[i]);
    }
    this.dragging(false);
    if (files.length) {
        this.files(files);
        this.loadingSongContents(true);
        this.onFiles(files);
    }
};

ViewModel.prototype.reset = function() {
    this.errorText("");
    this.dragging(false);
    this.loadingSongContents(false);
};

ViewModel.prototype.listFiles = function() {
    var fileNames = this.files().map(function(file) {
        var dotSeperatedChunks = file.name.split(".");
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

module.exports = new ViewModel();

function timeFormat(s) {
    var seconds = Math.floor(s % 60);
    var formattedSeconds = (seconds < 10) ? ("0" + seconds) : seconds;
    var minutes = Math.floor(s / 60);
    return minutes + ":" + formattedSeconds;
}
