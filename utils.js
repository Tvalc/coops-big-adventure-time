window.Utils = {
    clamp: function(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },
    rectsOverlap: function(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    },
    lerp: function(a, b, t) {
        return a + (b - a) * t;
    },
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    sign: function(x) {
        return x < 0 ? -1 : (x > 0 ? 1 : 0);
    }
};