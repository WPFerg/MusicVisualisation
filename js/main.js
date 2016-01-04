require(["knockout", "viewModel", "audio", "visualiser"], function(ko, viewModel, audio, visualiser) {

    // Link up viewModel with audio/visualiser
    var files = [];
    viewModel.onFiles = function(droppedFiles) {
        files = droppedFiles;
        playMostRecent();
    };

    audio.onEnded = function() {
        files.shift();
        playMostRecent();
    };

    function playMostRecent() {
        viewModel.playingSong(false);
        viewModel.listFiles.call(viewModel, files);
        audio.playFile(files[0]).then(function() {
            viewModel.loadingSongContents(false);
            viewModel.playingSong(true);
            visualiser.visualise();
        }, viewModel.errorDecoding.bind(viewModel));
    }

    document.body.addEventListener("dragover", viewModel.onDrag.bind(viewModel));
    document.body.addEventListener("dragenter", viewModel.onDrag.bind(viewModel));
    document.body.addEventListener("drop", viewModel.onDrop.bind(viewModel));

    ko.applyBindings(viewModel);
});
