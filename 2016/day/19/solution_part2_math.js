var elves = 3014387,
    r = Math.pow(3, Math.floor( (Math.log2(elves - 1) / Math.log2(3)))),
    a = elves - r + Math.max(elves - 2 * r, 0);

console.log(a);
