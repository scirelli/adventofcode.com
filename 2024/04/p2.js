#!/usr/bin/env node
/*
--- Day 4: Ceres Search ---
--- Part Two ---

The Elf looks quizzically at you. Did you misunderstand the assignment?

Looking for the instructions, you flip over the word search to find that this isn't actually an XMAS puzzle; it's an X-MAS puzzle in which you're supposed to find two MAS in the shape of an X. One way to achieve that is like this:

M.S
.A.
M.S

Irrelevant characters have again been replaced with . in the above diagram. Within the X, each MAS can be written forwards or backwards.

Here's the same example from before, but this time all of the X-MASes have been kept instead:

.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........

In this example, an X-MAS appears 9 times.

Flip the word search from the instructions back over to the word search side and try again. How many times does an X-MAS appear?
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');

const rl = readline.createInterface({input});
const word = 'MAS';
let grid = [];
let width = 0, height = 0;
let map = {};

if(!String.prototype.reverse)
	String.prototype.reverse = function reverse() {
		return this.split('').reverse().join('');
	};

function xy2i(x, y) {
	if(x>=width || y>=height) return -1;
	return (y * width) + x;
}

function diagonal(x,y) {
	if(x>=0 && x < width && y >= 0 && y < height){
		// x
		//  x
		//   x
		let s =
				grid[xy2i(x+0,y+0)] +
				grid[xy2i(x+1,y+1)] +
				grid[xy2i(x+2,y+2)];
		if(s === word || s.reverse() === word){
			if(map[(x+1) + ',' + (y+1)] !== undefined) 
				map[(x+1) + ',' + (y+1)] += 1
			else
				map[(x+1) + ',' + (y+1)] = 0
		};

		//   x
		//  x
		// x
		s =
				grid[xy2i(x+0,y-0)] +
				grid[xy2i(x+1,y-1)] +
				grid[xy2i(x+2,y-2)];
		if(s === word || s.reverse() === word){
			if(map[(x+1) + ',' + (y-1)] !== undefined) 
				map[(x+1) + ',' + (y-1)] += 1
			else
				map[(x+1) + ',' + (y-1)] = 0
		};
	}
}

rl.on('line', (function() {
    return line => {
			height++;
			let s = line.split('');
			width = s.length;
			grid = grid.concat(s);
    };
})());

rl.on('close', ()=>{
	let t=0;
	for(let y=0; y<height; y++){
		for(let x=0; x<width; x++){
			diagonal(x,y);
		}
	}
	for(let x in map){
		t+=map[x];
	}
	console.log(t);
});
