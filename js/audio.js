define([], function() {
    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var sourceNode;
    analyser.connect(ctx.destination);

    const fftSize = analyser.fftSize;
    const frequencyBinCount = analyser.frequencyBinCount;

    var audio = {};

    audio.stop = function() {
        if (sourceNode) {
            sourceNode.stop(0);
            sourceNode.disconnect();
            sourceNode = null;
        }
    };

    audio.playBuffer = function(buffer, callback) {
        ctx.decodeAudioData(buffer, function(audioData) {
            sourceNode = ctx.createBufferSource();
            sourceNode.connect(analyser);
            sourceNode.onended = audio.stop;
            sourceNode.buffer = audioData;
            sourceNode.start(0);
            if (callback) {
                callback();
            }
        });
    };

    audio.playFile = function(file, callback) {
        audio.stop();
        var reader = new FileReader();

        reader.readAsArrayBuffer(file);
        reader.onloadend = function () {
            audio.playBuffer(reader.result, callback);
        };
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

    audio.fftSize = fftSize;
    audio.frequencyBinCount = frequencyBinCount;

    return audio;
});
