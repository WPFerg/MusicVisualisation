define(["viewModel", "audio", "visualiser"], function(viewModel, audio, visualiser) {

    var _files = [];

    var fileManipulator = {};
    fileManipulator.add = function(files) {
        var autoplay = _files.length === 0;
        _files = _files.concat(files);
        fileManipulator.onUpdate();

        if (autoplay) {
            fileManipulator.playFile();
        }
    },

    fileManipulator.onUpdate = function() {
        viewModel.files(_files);
    },

    fileManipulator.playFile = function() {
        if (_files[0]) {
            audio.playFile(_files[0]).then(function() {
                viewModel.loadingSongContents(false);
                viewModel.playingSong(true);
                visualiser.visualise();
            }, viewModel.errorDecoding.bind(viewModel));
        }
    },

    fileManipulator.onEnded = function() {
        _files.shift();
        viewModel.playingSong(false);
        fileManipulator.onUpdate();
        fileManipulator.playFile();
    };

    return fileManipulator;
});
