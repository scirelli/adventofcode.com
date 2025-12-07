#!/usr/bin/env node
/*
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');

const rl = readline.createInterface({input});
const	map = [];
const dirGen = function dir() {
	let dirI = 0;
	const d = [
		new Point(0,-1),
		new Point(1,0),
		new Point(0,1),
		new Point(-1,0)
	];

	function dir(){
		return d[dirI];
	}

	dir.turn = function turn() {
		dirI = ++dirI % d.length;
	}

	return dir;
};

let width = 0,
	height = 0,
	dir,
	startPos,
	guardPos;

rl.on('line', (function() {
	dir = dirGen();
	return line => {
		let t=0;
		if((t=line.indexOf('^')) !== -1){
			startPos = new Point(t, height);
			guardPos = startPos.clone();
		}

		map.push(...line.split(''));
		width = line.length;
		height++;
	}
})());

rl.on('close', ()=> {
	//console.log(map);
	//console.log(startPos);
	//console.log(`width: ${width} height: ${height}`);
	//console.log(map[ptoi(startPos)]);
	run();
});

function run() {
	const track = {};
	let n, cnt = 0;

	track[guardPos.toString()] = true;
	cnt++;

	while(inbounds(guardPos)){
		n = guardPos.clone().add(dir());
		if(isObsticle(n)) {
			dir.turn();
		}else if(outbounds(n)){
			break;
		}else{
			guardPos.add(dir());
			if(!track[guardPos.toString()]){
				cnt++;
				track[guardPos.toString()] = true;
			}
		}
	}
	console.log(cnt);
}

function inbounds(p) {
	return p.x >= 0 &&
				 p.x < width &&
		     p.y >= 0 &&
		     p.y < height;
}

function outbounds(p) {
	return !inbounds(p);
}

function isObsticle(p) {
	return getAt(p) === '#';
}

function getAt(p) {
	return map[ptoi(p)];
}

function Point(x=0,y=0) {
	this.x = x;
	this.y = y;
}

Point.prototype = {
	add: function add(p) {
		this.x += p.x;
		this.y += p.y;
		return this;
	},
	toString: function toString() {
		return `(${this.x}, ${this.y})`;
	},
	copy: function copy(p) {
		this.x = p.x;
		this.y = p.y;
		return this;
	},
	clone: function clone() {
		return new Point(this.x, this.y);
	}
};

function ptoi(p) {
	if(!inbounds(p)) return -1;
	return p.y*width + p.x;
}
