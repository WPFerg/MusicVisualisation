'use strict';

let d3 = require('d3');

module.exports = function(selector) {

    var width = selector.attr("width");
    var height = selector.attr("height");
    const numberOfBars = Math.floor(width / 5);
    const context = selector.node().getContext('2d');

    var xScale = d3.scale.linear()
        .range([0, width])
        .domain([0, numberOfBars]);

    var yScale = d3.scale.linear()
        .range([0, height])
        .domain([-128, 0]);

    // Remove any rects already in the selector
    selector.selectAll("rect").remove();

    // Add a transparent rect so scaleY scales the appropriate height
    selector.append("rect")
        .attr("class", "frequency-background")
        .attr({
            x: 0,
            y: 0,
            width: width,
            height: height
        });

    return function(data) {
        var aggregatedData = aggregate(data);

        context.clearRect(0, 0, width, height);

        const barWidth = width / numberOfBars;
        aggregatedData.forEach((d, i) => {
            const barHeight = yScale(d);
            const gradient = context.createLinearGradient(0, height - barHeight, 0, height);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
            context.fillStyle = gradient;
            context.fillRect(xScale(i), height - barHeight, barWidth, barHeight);
        });
        context.fillStyle = null;
    };

    // Bucket the data and average them
    function aggregate(data) {
        var aggregated = new Float32Array(numberOfBars);

        for(var i = 0; i < numberOfBars; i++) {
            var lowerBound = Math.floor(i / numberOfBars * data.length);
            var upperBound = Math.floor((i + 1) / numberOfBars * data.length);
            var bucket = data.slice(lowerBound, upperBound);

            aggregated[i] = bucket.reduce(function(acc, d) {
                return acc + d;
            }, 0) / bucket.length;
        }

        return aggregated;
    }
};
