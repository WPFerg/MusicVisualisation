define(["knockout"], function(ko) {
    var noop = function(){};

    var ViewModel = function ViewModel() {
        this.dragging = ko.observable(false);
        this.playingSong = ko.observable("");
        this.backgroundColour = ko.observable("");
        this.onFiles = noop;
    };

    ViewModel.prototype.setBackgroundColour = function(colour) {
        this.backgroundColour(colour);
    }.bind(this);

    ViewModel.prototype.onDrag = function(event) {
        console.log("Drag");
        this.dragging(true);
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        return false;
    };

    ViewModel.prototype.onDrop = function(event) {
        console.log("Drop");
        event.preventDefault();
        var dtFiles = event.dataTransfer.files;
        var files = [];
        for (var i = 0; i < dtFiles.length; i++) {
            files.push(dtFiles[i]);
        }
        console.log(files);
        this.onFiles(files);
    };

    return new ViewModel();
});
