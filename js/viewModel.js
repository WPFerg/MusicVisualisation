define(["knockout"], function(ko) {
    var noop = function(){};

    var ViewModel = function ViewModel() {
        this.dragging = ko.observable(false);
        this.playingSong = ko.observable(false);
        this.loadingSongContents = ko.observable(false);
        this.errorText = ko.observable();
        this.fileList = ko.observableArray([]);
        this.onFiles = noop;
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
            this.loadingSongContents(true);
            this.listFiles(files);
            this.onFiles(files);
        }
    };

    ViewModel.prototype.reset = function() {
        this.errorText("");
        this.fileList([]);
    };

    ViewModel.prototype.listFiles = function(files) {
        var fileNames = files.map(function(file) {
            var dotSeperatedChunks = file.name.split(".");
            var fileExtRemovedChunks = dotSeperatedChunks.slice(0, dotSeperatedChunks.length - 1);
            return fileExtRemovedChunks.join(".");
        });
        this.fileList(fileNames);
        debugger;
    };

    ViewModel.prototype.errorDecoding = function() {
        this.errorText("There was an error decoding the file you dropped.");
        console.log(arguments);
    };

    return new ViewModel();
});
