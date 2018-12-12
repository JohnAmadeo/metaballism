function rad(deg) { return (deg * Math.PI) / 180; }
function l(...args) { console.log(...args); }
function within(a, b) { return Math.abs(a - b) < 0.0001; }

// module.exports = {
// 	rad,
// 	l,
// 	within,
// };