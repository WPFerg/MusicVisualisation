define([], function() {
    var noop = function(){};

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
            audio.onEnded();
        }
    };

    audio.playBuffer = function(buffer) {
        return new Promise(function(resolve, reject) {
            ctx.decodeAudioData(buffer, function(audioData) {
                sourceNode = ctx.createBufferSource();
                sourceNode.connect(analyser);
                sourceNode.onended = audio.stop;
                sourceNode.buffer = audioData;
                sourceNode.start(0);
                resolve();
            }, reject);
        });
    };

    audio.playFile = function(file) {
        audio.stop();
        return new Promise(function(resolve, reject) {
            var reader = new FileReader();

            reader.readAsArrayBuffer(file);
            reader.onloadend = function() {
                audio.playBuffer(reader.result).then(resolve, reject);
            };
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
