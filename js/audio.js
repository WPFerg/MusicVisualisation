var noop = function(){};
window.AudioContext = window.AudioContext || window.webkitAudioContext;

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
        audioElement = null;
        audio.onEnded();
    }
};

audio.playPause = function() {
    if (audioElement) {
        if (audioElement.paused) {
            audioElement.play();
        } else {
            audioElement.pause();
        }
    }
};

audio.playFile = function(file) {
    audio.stop();
    return new Promise(function(resolve, reject) {
        if (!audioElement) {
            audioElement = document.createElement('audio');
            audioElement.src = file;
            sourceNode = ctx.createMediaElementSource(audioElement);
            sourceNode.connect(analyser);

            audioElement.addEventListener('playing', resolve);
            audioElement.addEventListener('error', reject);
            audioElement.addEventListener('ended', audio.stop);

            audioElement.play();
        }
    });
};

audio.bindPlayingListener = function(callback) {
    audioElement.addEventListener('playing', callback);
};

audio.isPlaying = function() {
    return !!sourceNode && (audioElement && !audioElement.paused);
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

audio.getProgress = function() {
    return audioElement.currentTime;
};

audio.getDuration = function() {
    return audioElement.duration;
};

audio.onEnded = noop;

audio.fftSize = fftSize;
audio.frequencyBinCount = frequencyBinCount;

module.exports = audio;
