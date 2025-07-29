// General utility functions

window.Utils = {
  clamp: function(val, min, max) {
    return Math.max(min, Math.min(max, val));
  },
  randBetween: function(a, b) {
    return a + Math.random() * (b - a);
  },
  lerp: function(a, b, t) {
    return a + (b - a) * t;
  },
  randomColor: function() {
    // For enemy color variations
    const hues = [0, 30, 180, 220, 310];
    const h = hues[Math.floor(Math.random() * hues.length)];
    return `hsl(${h}, 84%, 58%)`;
  },
  drawRoundedRect: function(ctx, x, y, w, h, r, fill, stroke) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) ctx.fillStyle = fill, ctx.fill();
    if (stroke) ctx.strokeStyle = stroke, ctx.stroke();
    ctx.restore();
  }
};