define(["viewModel", "audio", "visualiser"], function(viewModel, audio, visualiser) {

    var _files = [];
    var _playingFile = null;

    var fileManipulator = {};
    fileManipulator.add = function(files) {
        var autoplay = _files.length === 0;
        _files = _files.concat(files);
        fileManipulator.onUpdate();

        if (autoplay) {
            fileManipulator.playFile();
        }
    };

    fileManipulator.remove = function(i) {
        var victimFile = _files[i];
        _files.splice(i, 1);

        if (victimFile === _playingFile) {
            audio.stop();
        }
        fileManipulator.onUpdate();
    }

    fileManipulator.onUpdate = function() {
        viewModel.files(_files);
    };

    fileManipulator.playFile = function() {
        if (_files[0]) {
            audio.playFile(_files[0]).then(function() {
                _playingFile = _files[0];
                viewModel.loadingSongContents(false);
                viewModel.playingSong(true);
                visualiser.visualise();
            }, viewModel.errorDecoding.bind(viewModel));
        }
    };

    fileManipulator.onEnded = function() {
        // Remove the playing file
        _files = _files.filter(function(file) {
            return file !== _playingFile;
        });

        _playingFile = null;
        viewModel.playingSong(false);
        fileManipulator.onUpdate();
        fileManipulator.playFile();
    };

    return fileManipulator;
});
