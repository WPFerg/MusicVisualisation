define(["d3", "audio", "visualisations/waveform", "visualisations/frequency", "visualisations/background"],
    function(d3, audio, waveform, frequency, background) {
        const fftSize = 2048;
        var waveformArray = new Float32Array(fftSize);
        var frequencyArray = new Float32Array(fftSize / 2);

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

        svg.select(".background").attr("width", width);
        svg.select(".background").attr("height", height);

        var waveformVisualiser = waveform(svg.select(".waveform"));
        var frequencyVisualiser = frequency(svg.select(".frequency"));
        var backgroundVisualiser = background(svg.select(".background"), svg);

        visualiser.visualise = function() {
            if (audio.isPlaying()) {
                audio.getFloatWaveform(waveformArray);
                audio.getFloatFrequency(frequencyArray);

                frequencyVisualiser(frequencyArray);
                backgroundVisualiser(frequencyArray);
                waveformVisualiser(waveformArray);

                requestAnimationFrame(visualiser.visualise);
            }
        };

        return visualiser;
});
