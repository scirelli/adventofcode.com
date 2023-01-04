#!/usr/bin/env node
/*
 --- Day 12: Hill Climbing Algorithm ---
You try contacting the Elves using your handheld device, but the river you're following must be too low to get a decent signal.

You ask the device for a heightmap of the surrounding area (your puzzle input). The heightmap shows the local area from above broken into a grid; the elevation of each square of the grid is given by a single lowercase letter, where a is the lowest elevation, b is the next-lowest, and so on up to the highest elevation, z.

Also included on the heightmap are marks for your current position (S) and the location that should get the best signal (E). Your current position (S) has elevation a, and the location that should get the best signal (E) has elevation z.

You'd like to reach E, but to save energy, you should do it in as few steps as possible. During each step, you can move exactly one square up, down, left, or right. To avoid needing to get out your climbing gear, the elevation of the destination square can be at most one higher than the elevation of your current square; that is, if your current elevation is m, you could step to elevation n, but not to elevation o. (This also means that the elevation of the destination square can be much lower than the elevation of your current square.)

For example:

Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
Here, you start in the top-left corner; your goal is near the middle. You could start by moving down or right, but eventually you'll need to head toward the e at the bottom. From there, you can spiral around to the goal:

v..v<<<<
>v.vv<<^
.>vv>E^^
..v>>>^^
..>>>>>^
In the above diagram, the symbols indicate whether the path exits each square moving up (^), down (v), left (<), or right (>). The location that should get the best signal is still E, and . marks unvisited squares.

This path reaches the goal in 31 steps, the fewest possible.
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');
const Area = require('./area.js');

const rl = readline.createInterface({input});
const ALGORITHM = 'Dijkstra'; //'DFS';

let area = [],
    width = 0,
    height = 0,
    start = null,
    goal = null;


rl.on('line', (function() {
    return line => {
        width = line.length;
        height++;
        if(line.indexOf('S') !== -1) {
            start = new Area.Point(line.indexOf('S'), height-1);
            line = line.replace('S', 'a');
        }
        if(line.indexOf('E') !== -1) {
            goal = new Area.Point(line.indexOf('E'), height-1);
            line = line.replace('E', 'z');
        }
        area = area.concat(line.split(''));
    };
})());

rl.on('close', ()=>{
    const t = new Area[ALGORITHM](new Area.Area(area, width, height, start, goal));
    console.log(t.shortestPath());
});