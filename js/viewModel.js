define(["knockout"], function(ko) {
    var noop = function(){};

    var ViewModel = function ViewModel() {
        this.dragging = ko.observable(false);
        this.playingSong = ko.observable(false);
        this.loadingSongContents = ko.observable(false);
        this.onFiles = noop;
    };

    ViewModel.prototype.onDrag = function(event) {
        console.log("Drag");
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
        this.loadingSongContents(true);
        this.onFiles(files);
    };

    return new ViewModel();
});
