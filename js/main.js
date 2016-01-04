require(["knockout", "viewModel", "audio", "visualiser"], function(ko, viewModel, audio, visualiser) {

    // Link up viewModel with audio/visualiser

    viewModel.onFiles = function(files) {
        audio.playFile(files[0]).then(function() {
            viewModel.loadingSongContents(false);
            viewModel.playingSong(true);
            visualiser.visualise();
        }, viewModel.errorDecoding.bind(viewModel));
    };

    document.body.addEventListener("dragover", viewModel.onDrag.bind(viewModel));
    document.body.addEventListener("dragenter", viewModel.onDrag.bind(viewModel));
    document.body.addEventListener("drop", viewModel.onDrop.bind(viewModel));

    ko.applyBindings(viewModel);
});
