'use strict';
let d3 = require('d3');
let frequency = require('./visualisations/frequency');
let waveform = require('./visualisations/waveform');
let background = require('./visualisations/background');

module.exports = function(audio) {
        var noop = function() {};

        var waveformArray = new Float32Array(audio.fftSize);
        var frequencyArray = new Float32Array(audio.frequencyBinCount);

        var visualiser = {};
        var waveformVisualiser;
        var frequencyVisualiser;
        var backgroundVisualiser;

        function initialise() {

            var width = window.innerWidth || document.body.offsetWidth;
            var height = window.innerHeight || document.body.offsetHeight;

            d3.select(".waveform")
                .attr({
                    width: width,
                    height: height / 2
                })
                .style({
                    position: 'absolute',
                    top: height / 2,
                    left: 0
                });

            d3.select(".frequency")
                .attr({
                    width: width,
                    height: height / 2
                })
                .style({
                    position: 'absolute',
                    top: 0,
                    left: 0
                });

            // Recreate the visualisers on each resize (no major difference to calling a resize funct)
            waveformVisualiser = waveform(d3.select(".waveform"), audio.fftSize);
            frequencyVisualiser = frequency(d3.select(".frequency"));
            backgroundVisualiser = background(d3.select('body'));
        }

        visualiser.visualise = function() {
            var playing = audio.isPlaying();
            if (playing) {
                audio.getFloatWaveform(waveformArray);
                audio.getFloatFrequency(frequencyArray);

                frequencyVisualiser(frequencyArray);
                backgroundVisualiser(frequencyArray);
                waveformVisualiser(waveformArray);

                visualiser.updateProgress(audio.getProgress());
                visualiser.updateDuration(audio.getDuration());

                requestAnimationFrame(visualiser.visualise);
            }
            visualiser.active = playing;
        };

        visualiser.active = false;
        visualiser.onResize = initialise;
        visualiser.updateDuration = noop;
        visualiser.updateProgress = noop;

        initialise();

        return visualiser;
};
