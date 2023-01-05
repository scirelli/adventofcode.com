#!/usr/bin/env node
/*
 --- Day 12: Hill Climbing Algorithm ---
--- Part Two ---

As you walk up the hill, you suspect that the Elves will want to turn this into a hiking trail. The beginning isn't very scenic, though; perhaps you can find a better starting point.

To maximize exercise while hiking, the trail should start as low as possible: elevation a. The goal is still the square marked E. However, the trail should still be direct, taking the fewest steps to reach its goal. So, you'll need to find the shortest path from any square at elevation a to the square marked E.

Again consider the example from above:

Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi

Now, there are six choices for starting position (five marked a, plus the square marked S that counts as being at elevation a). If you start at the bottom-left square, you can reach the goal most quickly:

...v<<<<
...vv<<^
...v>E^^
.>v>>>^^
>^>>>>>^

This path reaches the goal in only 29 steps, the fewest possible.

What is the fewest steps required to move starting from any square with elevation a to the location that should get the best signal?
*/
const readline = require('node:readline');
const {stdin: input} = require('node:process');
const Area = require('./area.js');

const rl = readline.createInterface({input});
const ALGORITHM = 'Dijkstra1';
//const ALGORITHM = 'DFS';

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
    let a = new Area.Area(area, width, height, goal, start);
    console.debug(a.toString());
    const t = new Area[ALGORITHM](a);
    console.log(t.shortestPath().sort((a,b)=>a.dist-b.dist).shift().dist);
});
