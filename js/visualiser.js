define(["d3", "audio", "visualisations/waveform", "visualisations/frequency"],
    function(d3, audio, waveform, frequency) {
        var visualiser = {};

        var svg = d3.select("#svg");

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;

        svg.attr("width", width);
        svg.attr("height", height);

        svg.select(".waveform").attr("width", width);
        svg.select(".waveform").attr("height", height/2);
        svg.select(".waveform")
            .attr("transform", "translate(0, " + height / 2 + ")");

        svg.select(".frequency").attr("width", width);
        svg.select(".frequency").attr("height", height/2);

        var waveformVisualiser = waveform(svg.select(".waveform"));
        var frequencyVisualiser = frequency(svg.select(".frequency"))

        visualiser.visualise = function() {
            var floatWaveform = audio.getFloatWaveform();
            var frequencyData = audio.getFloatFrequency();

            frequencyVisualiser(frequencyData);
            waveformVisualiser(floatWaveform);

            requestAnimationFrame(visualiser.visualise);
        };

        return visualiser;
});
