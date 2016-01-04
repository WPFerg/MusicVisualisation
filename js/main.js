require(["knockout", "viewModel", "audio", "files"], function(ko, viewModel, audio, files) {

    // Link up viewModel with audio/visualiser
    viewModel.onFiles = files.add;
    audio.onEnded = files.onEnded;

    document.body.addEventListener("dragover", viewModel.onDrag.bind(viewModel));
    document.body.addEventListener("dragenter", viewModel.onDrag.bind(viewModel));
    document.body.addEventListener("drop", viewModel.onDrop.bind(viewModel));

    ko.applyBindings(viewModel);
});
