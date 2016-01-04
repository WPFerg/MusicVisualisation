define([], function() {
    return function(selector) {

        var width = selector.attr("width");
        var height = selector.attr("height");
        const numberOfBars = Math.floor(width / 5);

        var xScale = d3.scale.linear()
            .range([0, selector.attr("width")])
            .domain([0, numberOfBars]);

        var yScale = d3.scale.linear()
            .range([0, selector.attr("height")])
            .domain([-200, 0]);

        // Remove any rects already in the selector
        selector.selectAll("rect").remove();

        return function(data) {
            var aggregatedData = aggregate(data);

            var rect = selector.selectAll("rect")
                .data(aggregatedData);

            rect.enter()
                .append("rect")
                .attr("x", function(d, i) {
                    return xScale(i);
                })
                .attr("width", function() {
                    return selector.attr("width") / numberOfBars;
                });

            rect.attr("height", function(d) {
                    var rectHeight = yScale(d);
                    return rectHeight > 0 ? rectHeight : 0;
                })
                .attr("y", function(d) {
                    var rectHeight = yScale(d);
                    return height - (rectHeight > 0 ? rectHeight : 0);
                });
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
});
