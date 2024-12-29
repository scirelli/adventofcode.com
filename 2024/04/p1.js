#!/usr/bin/env node
/*
--- Day 4: Ceres Search ---

"Looks like the Chief's not here. Next!" One of The Historians pulls out a device and pushes the only button on it. After a brief flash, you recognize the interior of the Ceres monitoring station!

As the search for the Chief continues, a small Elf who lives on the station tugs on your shirt; she'd like to know if you could help her with her word search (your puzzle input). She only has to find one word: XMAS.

This word search allows words to be horizontal, vertical, diagonal, written backwards, or even overlapping other words. It's a little unusual, though, as you don't merely need to find one instance of XMAS - you need to find all of them. Here are a few ways XMAS might appear, where irrelevant characters have been replaced with .:

..X...
.SAMX.
.A..A.
XMAS.S
.X....

The actual word search will be full of letters instead. For example:

MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX

In this word search, XMAS occurs a total of 18 times; here's the same word search again, but where letters not involved in any XMAS have been replaced with .:

....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX

Take a look at the little Elf's word search. How many times does XMAS appear?
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');

const rl = readline.createInterface({input});
const word = 'XMAS';
let grid = [];
let width = 0, height = 0;

if(!String.prototype.reverse)
	String.prototype.reverse = function reverse() {
		return this.split('').reverse().join('');
	};

function xy2i(x, y) {
	if(x>=width || y>=height) return -1;
	return (y * width) + x;
}

//horizontal, vertical, diagonal, written backwards, or even overlapping other words
function horizontal(x,y) {
	let cnt = 0;
	//checks fwd and back
	if(x>=0 && x < width && y >= 0 && y < height){
		let s = grid[xy2i(x+0,y)] +
					grid[xy2i(x+1,y)] +
					grid[xy2i(x+2,y)] +
					grid[xy2i(x+3,y)];
		if(s === word) cnt++;
		if(s.reverse() === word) cnt++;
	}
	return cnt;
}

function vertical(x,y) {
	let cnt = 0;
	//checks fwd and back
	if(x>=0 && x < width && y >= 0 && y < height){
		let s =
				grid[xy2i(x,y+0)] +
				grid[xy2i(x,y+1)] +
				grid[xy2i(x,y+2)] +
				grid[xy2i(x,y+3)];
		if(s === word) cnt++;
		if(s.reverse() === word) cnt++;
	}
	return cnt;
}

function diagonal(x,y) {
	let cnt = 0;
	//checks fwd and back
	if(x>=0 && x < width && y >= 0 && y < height){
		let s =
				grid[xy2i(x+0,y+0)] +
				grid[xy2i(x+1,y+1)] +
				grid[xy2i(x+2,y+2)] +
				grid[xy2i(x+3,y+3)];
		if(s === word) cnt++;
		if(s.reverse() === word) cnt++;
		s =
				grid[xy2i(x+0,y-0)] +
				grid[xy2i(x+1,y-1)] +
				grid[xy2i(x+2,y-2)] +
				grid[xy2i(x+3,y-3)];
		if(s === word) cnt++;
		if(s.reverse() === word) cnt++;
	}
	return cnt;
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
			t += horizontal(x,y) + vertical(x,y) + diagonal(x,y);
		}
	}
	console.log(t);
});
