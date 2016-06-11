'use strict';

let d3 = require('d3');

module.exports = function(selector, fftSize) {

    var width = selector.attr("width");
    var height = selector.attr("height");

    let context = selector.node().getContext('2d');

    var numberOfPoints = Math.ceil(width / 2);

    var xScale = d3.scale.linear()
        .range([0, width])
        .domain([0, numberOfPoints]);

    var yScale = d3.scale.linear()
        .range([height, 0])
        .domain([-1, 1]);

    let lastMax;

    return function(data) {
        context.clearRect(0, yScale(lastMax) - 1, width, yScale(-lastMax) + 1);
        lastMax = null;
        context.moveTo(width / 2, yScale(0));
        context.beginPath();
        context.strokeStyle = 'black';
        subsample(data).forEach((d, i) => {
            context.lineTo(xScale(i), yScale(d));

            if (!lastMax || lastMax < d) {
                lastMax = d;
            }
        });
        context.stroke();
    };

    function subsample(data) {
        var subsampledData = new Float32Array(numberOfPoints);

        for (var i = 0; i < numberOfPoints; i++) {
            subsampledData[i] = data[Math.floor(i / numberOfPoints * data.length)];
        }
        return subsampledData;
    }
};
