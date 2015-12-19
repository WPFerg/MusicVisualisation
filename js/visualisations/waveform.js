define([], function() {
    return function(selector) {
        const fftSize = 2048;
        var xScale = d3.scale.linear()
            .range([0, selector.attr("width")])
            .domain([0, fftSize]);

        var yScale = d3.scale.linear()
            .range([selector.attr("height"), 0])
            .domain([-1, 1]);

        var line = d3.svg.line()
            .x(function(d, i) { return xScale(i); })
            .y(function(d, i) { return yScale(d); });

        return function(data) {
            selector.select("path")
                .datum(data)
                .attr("d", line);
        };
    };
});
