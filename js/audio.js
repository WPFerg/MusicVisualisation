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

    audio.getFloatWaveform = function() {
        var floatArray = new Float32Array(fftSize);
        analyser.getFloatTimeDomainData(floatArray);
        return floatArray;
    };

    audio.getFloatFrequency = function() {
        var floatArray = new Float32Array(fftSize);
        analyser.getFloatFrequencyData(floatArray);
        return floatArray;
    };

    return audio;
});
