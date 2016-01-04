define([], function() {
    var noop = function(){};

    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var audioElement;
    var sourceNode;
    analyser.connect(ctx.destination);

    const fftSize = analyser.fftSize;
    const frequencyBinCount = analyser.frequencyBinCount;

    var audio = {};

    audio.stop = function() {
        if (sourceNode) {
            sourceNode.disconnect();
            sourceNode = null;
            audioElement.pause();
            URL.revokeObjectURL(audioElement.src);
            audioElement = null;
            audio.onEnded();
        }
    };

    audio.playFile = function(file) {
        audio.stop();
        return new Promise(function(resolve, reject) {
            audioElement = document.createElement('audio');
            audioElement.src = URL.createObjectURL(file);
            sourceNode = ctx.createMediaElementSource(audioElement);
            sourceNode.onended = audio.stop;
            sourceNode.connect(analyser);

            audioElement.addEventListener('playing', resolve);
            audioElement.addEventListener('error', reject);

            audioElement.play();
        });
    };

    audio.isPlaying = function() {
        return !!sourceNode;
    };

    audio.getFloatWaveform = function(floatArray) {
        if (!arguments.length) {
            floatArray = new Float32Array(fftSize);
        }
        analyser.getFloatTimeDomainData(floatArray);
        return floatArray;
    };

    audio.getFloatFrequency = function(floatArray) {
        if (!arguments.length) {
            floatArray = new Float32Array(frequencyBinCount);
        }
        analyser.getFloatFrequencyData(floatArray);
        return floatArray;
    };

    audio.onEnded = noop;

    audio.fftSize = fftSize;
    audio.frequencyBinCount = frequencyBinCount;

    return audio;
});
