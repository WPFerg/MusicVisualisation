define([], function() {
    return function(selector, svg) {
        var scale = d3.scale.linear()
            .range([40, 75])
            .domain([-256, 0]);
        var hueScale = d3.scale.linear()
            .range([250, 200])
            .domain([-120, -50]);

        selector.select("rect")
            .attr("width", selector.attr("width"))
            .attr("height", selector.attr("height"));

        var lightModeDebouncer = debouncer(function(h, s, l) {
            if (l > 50) {
                svg.attr("class", "light");
            } else {
                svg.attr("class", "dark");
            }
        }, 500);

        return function(data) {
            var s = reduceArray(data.slice(0, 3));
            var h = reduceArray(data.slice(0, Math.floor(data.length / 3)));
            var l = reduceArray(data.slice(data));

            selector.select("rect")
                .attr("fill", "hsl(" + (hueScale(h)) + ", "
                    + scale(s) + "%,"
                    + scale(l) + "%)");

            lightModeDebouncer(hueScale(h), scale(s), scale(l));
        };
    };

    function reduceArray(d) {
        return d.reduce(function(a, x) {
            return a + x;
        }, 0) / d.length;
    }

    function debouncer(callback, intervalSize) {
        var timeout;

        return function() {
            if (timeout) {
                return;
            }
            timeout = window.setTimeout(function() {
                timeout = null;
            }, intervalSize);
            callback.apply(this, arguments);
        }
    }
});
