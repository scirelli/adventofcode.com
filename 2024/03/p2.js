#!/usr/bin/env node
/*
--- Day 3: Mull It Over ---
--- Part Two ---

As you scan through the corrupted memory, you notice that some of the conditional statements are also still intact. If you handle some of the uncorrupted conditional statements in the program, you might be able to get an even more accurate result.

There are two new instructions you'll need to handle:

    The do() instruction enables future mul instructions.
    The don't() instruction disables future mul instructions.

Only the most recent do() or don't() instruction applies. At the beginning of the program, mul instructions are enabled.

For example:

xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))

This corrupted memory is similar to the example from before, but this time the mul(5,5) and mul(11,8) instructions are disabled because there is a don't() instruction before them. The other mul instructions function normally, including the one at the end that gets re-enabled by a do() instruction.

This time, the sum of the results is 48 (2*4 + 8*5).

Handle the new instructions; what do you get if you add up all of the results of just the enabled multiplications?
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');

const rl = readline.createInterface({input});
const insts = [];

function parseNumber(line, d) {
	let n = '';

	while(d.i<line.length) {
		if(line[d.i] >= '0' && line[d.i] <= '9'){
			n += line[d.i];
			d.i++;
		}else{
			break;
		}
	}

	return parseInt(n);
}

function parseMul(line, d) {
	instr = [];
	if(line[d.i] === 'm'){
		d.i++;
		if(line[d.i] === 'u'){
			d.i++;
			if(line[d.i] === 'l'){
				d.i++;
				if(line[d.i] === '('){
					d.i++;
					let n1 = parseNumber(line, d);
					if(!isNaN(n1)){
						if(line[d.i] === ','){
							d.i++;
							let n2 = parseNumber(line, d);
							if(!isNaN(n2)){
								if(line[d.i] === ')'){
									d.i++;
									instr.push(n1, n2);
								}
							}
						}
					}
				}
			}
		}
	}
	return instr;
}

function parseDoes(line, d) {
	let rtn = -1;

	if(line[d.i] === 'd'){
		d.i++;
		if(line[d.i] === 'o'){
			d.i++;
			if(line[d.i] === '('){
				d.i++;
				if(line[d.i] === ')'){
					d.i++;
					rtn = 1;
				}
			} else if(line[d.i] === 'n'){
				d.i++;
				if(line[d.i] === "'"){
					d.i++;
					if(line[d.i] === "t"){
						d.i++;
						if(line[d.i] === "("){
							d.i++;
							if(line[d.i] === ")"){
								d.i++;
								rtn = 0;
							}
						}
					}
				}
			}
		}
	}
	return rtn;
}

function parseInstr(line, d={i:0}) {
	const instr = [];
	let t = -1;

	while(d.i<line.length) {
		t = parseMul(line, d);
		if(t.length) instr.push(t);
		t = parseDoes(line, d);
		if(t !== -1) instr.push(t);

		if(line[d.i] !== 'm' && line[d.i] !== 'd')
			d.i++;
	}
	return instr;
}

rl.on('line', (function() {
    return line => {
			const d = {i:0};
			let instr = parseInstr(line, d);
			while(instr.length){
				insts.push(...instr);
				instr = parseInstr(line, d);
			}
    };
})());

rl.on('close', ()=>{
	let dos = true;
	//console.log(insts);
	console.log(insts.reduce((a,i)=>{
		if(Array.isArray(i)){
			if(dos){
				a += (i[0] * i[1]);
			}
		}else dos = i;

		return a;
	}, 0));
});
