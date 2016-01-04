require(["knockout", "viewModel", "audio", "files", "visualiser"], function(ko, viewModel, audio, files, visualiser) {

    // Link up viewModel with audio/visualiser
    viewModel.onFiles = files.add;
    audio.onEnded = files.onEnded;

    document.body.addEventListener("dragover", viewModel.onDrag.bind(viewModel));
    document.body.addEventListener("dragenter", viewModel.onDrag.bind(viewModel));
    document.body.addEventListener("drop", viewModel.onDrop.bind(viewModel));
    window.addEventListener("resize", visualiser.onResize);

    ko.applyBindings(viewModel);
});
