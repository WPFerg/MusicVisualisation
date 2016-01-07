define(["d3", "audio", "visualisations/waveform", "visualisations/frequency", "visualisations/background"],
    function(d3, audio, waveform, frequency, background) {
        var noop = function() {};

        var waveformArray = new Float32Array(audio.fftSize);
        var frequencyArray = new Float32Array(audio.frequencyBinCount);

        var visualiser = {};
        var waveformVisualiser;
        var frequencyVisualiser;
        var backgroundVisualiser;

        function initialise() {
            var svg = d3.select("#svg");

            var width = window.innerWidth || document.body.offsetWidth;
            var height = window.innerHeight || document.body.offsetHeight;

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
            // Set up filter rects width/height
            svg.selectAll("#vignette rect").attr({
                x: 0,
                y: 0,
                width: width,
                height: height
            });


            // Recreate the visualisers on each resize (no major difference to calling a resize funct)
            waveformVisualiser = waveform(svg.select(".waveform"), audio.fftSize);
            frequencyVisualiser = frequency(svg.select(".frequency"));
            backgroundVisualiser = background(svg.select(".background"), svg);
        }

        visualiser.visualise = function() {
            if (audio.isPlaying()) {
                audio.getFloatWaveform(waveformArray);
                audio.getFloatFrequency(frequencyArray);

                frequencyVisualiser(frequencyArray);
                backgroundVisualiser(frequencyArray);
                waveformVisualiser(waveformArray);

                visualiser.updateProgress(audio.getProgress());
                visualiser.updateDuration(audio.getDuration());

                requestAnimationFrame(visualiser.visualise);
            }
        };

        visualiser.onResize = initialise;
        visualiser.updateDuration = noop;
        visualiser.updateProgress = noop;

        initialise();

        return visualiser;
});
