#!/usr/bin/env node
/*
--- Day 14: Regolith Reservoir ---
--- Part Two ---

You realize you misread the scan. There isn't an endless void at the bottom of the scan - there's floor, and you're standing on it!

You don't have time to scan the floor, so assume the floor is an infinite horizontal line with a y coordinate equal to two plus the highest y coordinate of any point in your scan.

In the example above, the highest y coordinate of any point is 9, and so the floor is at y=11. (This is as if your scan contained one extra rock path like -infinity,11 -> infinity,11.) With the added floor, the example above now looks like this:

        ...........+........
        ....................
        ....................
        ....................
        .........#...##.....
        .........#...#......
        .......###...#......
        .............#......
        .............#......
        .....#########......
        ....................
<-- etc #################### etc -->

To find somewhere safe to stand, you'll need to simulate falling sand until a unit of sand comes to rest at 500,0, blocking the source entirely and stopping the flow of sand into the cave. In the example above, the situation finally looks like this after 93 units of sand come to rest:

............o............
...........ooo...........
..........ooooo..........
.........ooooooo.........
........oo#ooo##o........
.......ooo#ooo#ooo.......
......oo###ooo#oooo......
.....oooo.oooo#ooooo.....
....oooooooooo#oooooo....
...ooo#########ooooooo...
..ooooo.......ooooooooo..
#########################

Using your scan, simulate the falling sand until the source of the sand becomes blocked. How many units of sand come to rest?
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');
const Point = require('./Point.js');
const DOWN = new Point(0, 1),
    DIAGNAL_LEFT = new Point(-1, 1),
    DIAGNAL_RIGHT = new Point(1, 1),
    CONTINUE = 1,
    END = 0;

const rl = readline.createInterface({input});
const barrierList = [],
    sandSpout = new Point(500, 0),
    UPPER_LEFT = new Point(1000, 1000),
    LOWER_RIGHT = new Point(0, 0),
    grid = [];

rl.on('line', (function() {
    return line => {
        let p = line.split(' -> ')
                .map(s=>s.split(',').map(Number))
                .map(n=>(new Point(...n)));

        barrierList.push(p);
        LOWER_RIGHT.x = p.reduce((a,v)=>Math.max(a, v.x), LOWER_RIGHT.x);
        LOWER_RIGHT.y = p.reduce((a,v)=>Math.max(a, v.y), LOWER_RIGHT.y);

        UPPER_LEFT.x = p.reduce((a,v)=>Math.min(a, v.x), UPPER_LEFT.x);
        UPPER_LEFT.y = p.reduce((a,v)=>Math.min(a, v.y), UPPER_LEFT.y);
    };
})());

rl.on('close', ()=>{
    //console.log(UPPER_LEFT);
    //console.log(LOWER_RIGHT);
    LOWER_RIGHT.y += 2;
    LOWER_RIGHT.x += 500;
    barrierList.push([new Point(0,LOWER_RIGHT.y), new Point(LOWER_RIGHT.x+1, LOWER_RIGHT.y)]);
    buildGrid();
    initGrid(barrierList, sandSpout);

    let s = sandSpout.clone(), grains = 0;
    while(grid[sandSpout.y][sandSpout.x] !== 'o'){
        grains++;
        s = runSim(grid, sandSpout);
    }
    printGrid(grid);
    console.log(grains);
});

function buildGrid(){
    for(let i=0; i<= LOWER_RIGHT.y; i++){
        grid.push(new Array(LOWER_RIGHT.x+2).fill('.'));
    }
}

function initGrid(barrierList, startPos) {
    grid[startPos.y][startPos.x] = '+';
    barrierList.forEach(b=>{
        for(let i=0,s,e; i<b.length; i++){
            s = b[i];
            e = b[i+1] || s;
            for(let y=Math.min(s.y,e.y); y<=Math.max(s.y,e.y); y++){
                for(let x=Math.min(s.x,e.x); x<=Math.max(s.x,e.x); x++){
                    grid[y][x] = '#';
                }
            }
        }
    });
}

function printGrid(grid){
    for(let i=0,r; i<=LOWER_RIGHT.y; i++){
        console.log(grid[i].join(''));
    }
}

function runSim(grid, sandSpout){
    let sand = sandSpout.clone(), tmp, v;
    
    while(grid[sandSpout.y][sandSpout.x] !== 'o'){
        tmp = sand.add(DOWN);
        v = grid[tmp.y][tmp.x];
        if(!(v === '#' || v === 'o')){
            sand = tmp;
            continue;
        }

        tmp = sand.add(DIAGNAL_LEFT);
        v = grid[tmp.y][tmp.x];
        if(!(v === '#' || v === 'o')){
            sand = tmp;
            continue;
        }

        tmp = sand.add(DIAGNAL_RIGHT);
        v = grid[tmp.y][tmp.x];
        if(!(v === '#' || v === 'o')){
            sand = tmp;
            continue;
        }

        break;
    }
    grid[sand.y][sand.x] = 'o';

    return sand;
}
