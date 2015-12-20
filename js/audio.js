define([], function() {
    const fftSize = 2048;

    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var sourceNode;
    analyser.connect(ctx.destination);

    var audio = {};

    audio.stop = function() {
        if (sourceNode) {
            sourceNode.stop(0);
            sourceNode.disconnect();
            sourceNode = null;
        }
    };

    audio.playBuffer = function(buffer, callback) {
        audio.stop();
        sourceNode = ctx.createBufferSource();
        sourceNode.connect(analyser);
        sourceNode.onended = audio.stop;

        ctx.decodeAudioData(buffer, function(audioData) {
            sourceNode.buffer = audioData;
            sourceNode.start(0);
            if (callback) {
                callback();
            }
        });
    };

    audio.playFile = function(file, callback) {
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
            // The frequency distribution is ~ 1/2 of fast fourier transform size
            floatArray = new Float32Array(Math.floor(fftSize / 2));
        }
        analyser.getFloatFrequencyData(floatArray);
        return floatArray;
    };

    return audio;
});
