#!/usr/bin/env node
/*
--- Part Two ---

While the Elves get to work printing the correctly-ordered updates, you have a little time to fix the rest of them.

For each of the incorrectly-ordered updates, use the page ordering rules to put the page numbers in the right order. For the above example, here are the three incorrectly-ordered updates and their correct orderings:

    75,97,47,61,53 becomes 97,75,47,61,53.
    61,13,29 becomes 61,29,13.
    97,13,75,29,47 becomes 97,75,47,29,13.

After taking only the incorrectly-ordered updates and ordering them correctly, their middle page numbers are 47, 29, and 47. Adding these together produces 123.

Find the updates which are not in the correct order. What do you get if you add up the middle page numbers after correctly ordering just those updates?
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');

const rl = readline.createInterface({input});
let rulesX = [],
	rulesY = [],
  pagesToProduce = [],
	invalidPages = [],
	map;

rl.on('line', (function() {
	let inputType = 0;
    return line => {
			if(line === '') {
				inputType = 1;
				return;
			}

			switch(inputType) {
				case 0:
					let t = line.split('|').map(Number);
					rulesX.push(t[0]);
					rulesY.push(t[1]);
					break;
				case 1:
					pagesToProduce.push(line.split(',').map(Number));
					break;
			}
    };
})());

rl.on('close', ()=> {
	map = buildMap();
	validPages();
	correctInvalidPages();
});

function validPages() {
	let sum = 0, s;

	for(let page of pagesToProduce){
		s = validPage(page);
		if(!s.length){
			console.log(page);
			sum += page[Math.floor(page.length/2)]
		}else{
			invalidPages.push(page);
		}
	}
	console.log(sum);
}

function correctInvalidPages(){
	let sum = 0, s;

	for(let page of invalidPages){
		s = validPage(page);
		if(!s.length){
			console.log(page);
			sum += page[Math.floor(page.length/2)]
		}else{
			let t=page[s[1]];
			page.splice(s[1],1);
			page.splice(s[0], 0, t);
			invalidPages.push(page);
		}
	}
	console.log(sum);
}

function validPage(page) {
	for(let i=0,r; i<page.length-1; i++) {
		r = map[page[i]];
		if(!r) continue;
		for(let k=i+1,t; k<page.length; k++){
			if(t=r.indexOf(page[k]) !== -1) return [i,k];
		}
	}
	return [];
}

function buildMap() {
	let xV, yV, map = {};

	for(let i=0, x,y; i<rulesY.length; i++) {
		yV = rulesY[i];
		xV = rulesX[i];

		if(map[yV] === undefined){
			map[yV] = [xV];
		}else{
			map[yV].push(xV);
		}
	}

	return map;
}
