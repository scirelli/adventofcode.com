#!/usr/bin/env node
/*
--- Day 3: Gear Ratios ---
--- Part Two ---
The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.

You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.

Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.

The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.

This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.

Consider the same engine schematic again:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.

What is the sum of all of the gear ratios in your engine schematic?
*/
const readline = require('node:readline');
const { stdin } = require('node:process');

const rl = readline.createInterface({
    input:    stdin,
    terminal: false
});

const input = [];

rl.on('line', line => {
    input.push(line.split(''));
});

rl.on('close', ()=>{
    console.log(dostuff());
});

/*
  TODO:
  1. Find all number start and end indices.
  2. Find numbers touching a gear. Store number and coordinate of gear.
  3. Then check for a gear only touching two numbers.
*/
function dostuff() {
    let gearMap = {};

    for(let y=0, l=input.length, nums=[], adjGears=[] ; y<l; y++) {
        nums = [];
        adjGears = [];
        for(let x=0, xl=input[y].length, c=null; x<xl; x++) {
            c = input[y][x];
            if(!isNumber(c)) {
                let f = {};
                adjGears.filter(g=>{
                    let key = g.join(', ');
                    if(!(key in f)) {
                        f[key] = true;
                        return true;
                    }
                    return false;
                }).forEach(g => {
                    let key = g.join(', ');
                    if(key in gearMap)
                        gearMap[key].push(parseInt(nums.join('')));
                    else
                        gearMap[key] = [parseInt(nums.join(''))];
                });
                nums = [];
                adjGears = [];
                continue;
            }
            nums.push(c);
            adjGears = adjGears.concat(findGear(x, y));
        }
        if(nums.length) {
            let f = {};
            adjGears.filter(g=>{
                let key = g.join(', ');
                if(!(key in f)) {
                    f[key] = true;
                    return true;
                }
                return false;
            }).forEach(g => {
                let key = g.join(', ');
                if(key in gearMap)
                    gearMap[key].push(parseInt(nums.join('')));
                else
                    gearMap[key] = [parseInt(nums.join(''))];
            });
        }
    }

    return Object.values(gearMap).filter(v=>v.length === 2).reduce((a, v)=>{
        a += v[0] * v[1];
        return a;
    }, 0);

    function findGear(x, y) {
        let xi=x, yi = y, gears = [];
        //top left
        xi = x - 1;
        yi = y - 1;
        if(isGear(xi, yi)) gears.push([xi, yi]);
        //top mid
        xi = x;
        yi = y - 1;
        if(isGear(xi, yi)) gears.push([xi, yi]);
        //top right
        xi = x + 1;
        yi = y - 1;
        if(isGear(xi, yi)) gears.push([xi, yi]);
        //mid left
        xi = x - 1;
        yi = y;
        if(isGear(xi, yi)) gears.push([xi, yi]);
        //mid right
        xi = x + 1;
        yi = y;
        if(isGear(xi, yi)) gears.push([xi, yi]);
        //bot left
        xi = x - 1;
        yi = y + 1;
        if(isGear(xi, yi)) gears.push([xi, yi]);
        //bot right
        xi = x + 1;
        yi = y + 1;
        if(isGear(xi, yi)) gears.push([xi, yi]);
        return gears;
    }
    function isNumber(c) {
        return c >= '0' && c <= '9';
    }
    function isGear(x, y) {
        return input[y] && input[y][x] === '*';
    }
}
