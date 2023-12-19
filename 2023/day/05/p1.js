#!/usr/bin/env node
/*
--- Day 5: If You Give A Seed A Fertilizer ---
--- Part Two ---

Everyone will starve if you only plant such a small number of seeds. Re-reading the almanac, it looks like the seeds: line actually describes ranges of seed numbers.

The values on the initial seeds: line come in pairs. Within each pair, the first value is the start of the range and the second value is the length of the range. So, in the first line of the example above:

seeds: 79 14 55 13

This line describes two ranges of seed numbers to be planted in the garden. The first range starts with seed number 79 and contains 14 values: 79, 80, ..., 91, 92. The second range starts with seed number 55 and contains 13 values: 55, 56, ..., 66, 67.

Now, rather than considering four seed numbers, you need to consider a total of 27 seed numbers.

In the above example, the lowest location number can be obtained from seed number 82, which corresponds to soil 84, fertilizer 84, water 84, light 77, temperature 45, humidity 46, and location 46. So, the lowest location number is 46.

Consider all of the initial seed numbers listed in the ranges on the first line of the almanac. What is the lowest location number that corresponds to any of the initial seed numbers?
*/
const readline = require('node:readline');
const { stdin } = require('node:process');

const rl = readline.createInterface({
    input:    stdin,
    terminal: false
});

const input = [];

rl.on('line', line => {
    if(!input.length) {
        input.push(line.split(':')[1].trim().split(' ').map(Number));
    }else if(line.trim() && line.charAt(0) >= 'a' && line.charAt(0) <= 'z') {
        input.push([]);
    }else if(line.trim() && line.charAt(0) >= '0' && line.charAt(0) <= '9') {
        input[input.length - 1].push(line.split(' ').map(Number));
    }
});

rl.on('close', ()=>{
    const seeds = input.shift(),
        paths = [];

    for(let si=0,seedRS, seedRL, sl=seeds.length; si<sl; si+=2){
        seedRS = seeds[si];
        seedRL = seeds[si+1];

        let path = [];
        paths.push(path);
        input.forEach(map => {
            let inRange = false;
            for(let i=0, l=map.length; i<l; i++){
                let [destinationRangeStart, sourceRangeStart, length] = map[i];
                if(seed >= sourceRangeStart && seed <= sourceRangeStart + length) {
                    seed = destinationRangeStart + (seed - sourceRangeStart)
                    path.push(seed);
                    inRange = true;
                    break;
                }
            }
            if(!inRange) path.push(seed);
        });
    }
    console.log(paths);
    console.log(paths.reduce((a, v)=>{
        if(a > v[v.length - 1]) return v[v.length - 1];
        return a;
        
    }, Number.MAX_SAFE_INTEGER));
});
