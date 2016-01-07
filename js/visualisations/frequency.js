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

            // Set the transform to force the scaleY
            selector.attr("style", "transform-origin: " + (width / 2) + "px " + (height / 2) + "px; transform: scaleY(-1);");

            var rect = selector.selectAll("rect.frequency-bar")
                .data(aggregatedData);

            rect.enter()
                .append("rect")
                .attr("x", function(d, i) {
                    return xScale(i);
                })
                .attr("width", function() {
                    return selector.attr("width") / numberOfBars;
                })
                .attr("y", 0)
                .attr("class", "frequency-bar");

            rect.attr("height", function(d) {
                    var rectHeight = yScale(d);
                    return rectHeight > 1 ? rectHeight : 1;
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
