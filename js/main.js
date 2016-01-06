require(["knockout", "viewModel", "audio", "files", "visualiser"], function(ko, viewModel, audio, files, visualiser) {

    // Link up viewModel with audio/visualiser
    viewModel.onFiles = files.add;
    viewModel.onRemoveFile = files.remove;
    viewModel.onPlayPause = audio.playPause;
    viewModel.isPlaying = audio.isPlaying;
    audio.onEnded = files.onEnded;

    visualiser.updateDuration = viewModel.setDuration.bind(viewModel);
    visualiser.updateProgress = viewModel.setProgress.bind(viewModel);

    document.body.addEventListener("dragover", viewModel.onDrag.bind(viewModel));
    document.body.addEventListener("dragenter", viewModel.onDrag.bind(viewModel));
    document.body.addEventListener("drop", viewModel.onDrop.bind(viewModel));
    window.addEventListener("resize", visualiser.onResize);

    ko.applyBindings(viewModel);
});
