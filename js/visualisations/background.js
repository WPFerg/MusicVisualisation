'use strict';

let d3 = require('d3');

module.exports = function(selector) {
    var scale = d3.scale.linear()
        .range([20, 90])
        .domain([-256, 0]);
    var hueScale = d3.scale.linear()
        .range([250, 200])
        .domain([-120, -50]);

    var lightModeDebouncer = debouncer(function(h, s, l) {
        if (l > 50) {
            selector.attr("class", "light");
        } else {
            selector.attr("class", "dark");
        }
    }, 500);

    return function(data) {
        var s = reduceArray(data.slice(0, 3));
        var h = reduceArray(data.slice(0, Math.floor(data.length / 3)));
        var l = reduceArray(data.slice(data));

        selector.style("background-color", "hsl(" + (hueScale(h)) + ", "
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
            clearInterval(timeout);
            timeout = null;
        }, intervalSize);
        callback.apply(this, arguments);
    }
}
