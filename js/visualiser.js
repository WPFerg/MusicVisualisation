define(["d3", "audio", "visualisations/waveform"], function(d3, audio, waveform) {
    var visualiser = {};

    var svg = d3.select("#svg");

    var width = document.body.clientWidth;
    var height = document.body.clientHeight;

    svg.attr("width", width);
    svg.attr("height", height);

    svg.select(".waveform").attr("width", width);
    svg.select(".waveform").attr("height", height);

    var waveformVisualiser = waveform(svg.select(".waveform"));

    visualiser.visualise = function() {
        var floatWaveform = audio.getFloatWaveform();

        waveformVisualiser(floatWaveform);

        requestAnimationFrame(visualiser.visualise);
    };

    return visualiser;

});
