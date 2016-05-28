'use strict';

let d3 = require('d3');

module.exports = function(selector, fftSize) {

    var width = selector.attr("width");
    var height = selector.attr("height");
    var numberOfPoints = Math.ceil(width / 5);

    var xScale = d3.scale.linear()
        .range([0, width])
        .domain([0, numberOfPoints]);

    var yScale = d3.scale.linear()
        .range([height, 0])
        .domain([-1, 1]);

    var line = d3.svg.line()
        .x(function(d, i) { return xScale(i); })
        .y(function(d, i) { return yScale(d); });

    return function(data) {
        selector.select("path")
            .datum(subsample(data))
            .attr("d", line);
    };

    function subsample(data) {
        var subsampledData = new Float32Array(numberOfPoints);

        for (var i = 0; i < numberOfPoints; i++) {
            subsampledData[i] = data[Math.floor(i / numberOfPoints * data.length)];
        }
        return subsampledData;
    }
};
