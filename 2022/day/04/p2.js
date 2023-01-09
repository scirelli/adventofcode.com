#!/usr/bin/env node
/*
 --- Day 4: Camp Cleanup ---
It seems like there is still quite a bit of duplicate work planned. Instead, the Elves would like to know the number of pairs that overlap at all.

In the above example, the first two pairs (2-4,6-8 and 2-3,4-5) don't overlap, while the remaining four pairs (5-7,7-9, 2-8,3-7, 6-6,4-6, and 2-6,4-8) do overlap:

5-7,7-9 overlaps in a single section, 7.
2-8,3-7 overlaps all of the sections 3 through 7.
6-6,4-6 overlaps in a single section, 6.
2-6,4-8 overlaps in sections 4, 5, and 6.
So, in this example, the number of overlapping assignment pairs is 4.

In how many assignment pairs do the ranges overlap?
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');

const rl = readline.createInterface({input});
let result = 0;

rl.on('line', (function() {
    return (input) => {
        console.log(`Received: ${input}`);
        if(overlaps(...input.split(',').map(s=>s.split('-').map(Number)).sort((a, b)=>a[0]-b[0]))) {
            result++;
        }
    };
})());

rl.on('close', ()=>{
    console.log(result);
});

function overlaps(p1, p2) {
    console.log(p1, p2);
    if(p2[0] >= p1[0] && p2[0] <= p1[1]) return true;
    if(p1[0] >= p2[0] && p1[0] <= p2[1]) return true;
    return false;
}
