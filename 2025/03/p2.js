#!/usr/bin/env node
/*
--- Day 3: Lobby ---
--- Part Two ---

The escalator doesn't move. The Elf explains that it probably needs more joltage to overcome the static friction of the system and hits the big red "joltage limit safety override" button. You lose count of the number of times she needs to confirm "yes, I'm sure" and decorate the lobby a bit while you wait.
Now, you need to make the largest joltage by turning on exactly twelve batteries within each bank.
The joltage output for the bank is still the number formed by the digits of the batteries you've turned on; the only difference is that now there will be 12 digits in each bank's joltage output instead of two.
Consider again the example from before:
987654321111111
811111111111119
234234234234278
818181911112111

Now, the joltages are much larger:
    In 987654321111111, the largest joltage can be found by turning on everything except some 1s at the end to produce 987654321111.
    In the digit sequence 811111111111119, the largest joltage can be found by turning on everything except some 1s, producing 811111111119.
    In 234234234234278, the largest joltage can be found by turning on everything except a 2 battery, a 3 battery, and another 2 battery near the start to produce 434234234278.
    In 818181911112111, the joltage 888911112111 is produced by turning on everything except some 1s near the front.
The total output joltage is now much larger: 987654321111 + 811111111119 + 434234234278 + 888911112111 = 3121910778619.
What is the new total output joltage?
*/

const readline = require('node:readline');
const { stdin: input} = require('node:process');
const rl = readline.createInterface({input});
const NUM_LENGTH = 12;
let sum = 0;

rl.on('line', (function() {
	return line => {
		let v = stack(line.split('').map(Number));
		console.log(v);
		//sum += parseInt(v.join(''));
	};
})());

rl.on('close', ()=>{
	console.log(sum);
});

function stack(a) {
	const s = [];

	for(let i=0; i<a.length; i++) {
		//Change this so that you can only pop off the amount of characters left in the input string.
		while(s.length && a[i] > s[s.length-1]) s.pop();
		s.push(a[i]);
	}

	return s.slice(0, NUM_LENGTH);
}

function moveAlong(a, start=0, find=9, result=[]) {
	if(find <= 0) return result;
	for(let i=start; i<a.length; i++) {
		if(a[i] === find){
			result.push(a[i]);
			start=i+1;	
			return moveAlong(a, i+1, 9, result);
		}
	}
	return moveAlong(a, start, find-1, result);
}

function conditions(a) {
	let nums = new Array(NUM_LENGTH).fill(0);
	
	for(let i=0; i<a.length-NUM_LENGTH; i++) {
		for(let j=0; j<nums.length; j++){
			if(a[i] > nums[j]) {
				nums[j] = a[i];
				for(let k=j+1; k<nums.length; k++){
					nums[k] = 0;
				}
				break;
			}
		}
	}
	for(let i=0; i<NUM_LENGTH; i++) {
		l = (a.length - NUM_LENGTH) + i;
		if(a[l] > nums[i]) {
			nums[i] = a[l];
			for(let k=i+1; k<nums.length; k++){
				nums[k] = 0;
			}
		}
	}
	return nums.join('');
}

function bruteForce(a) {
	let rtn ='000000000000';
	for(  let i=0, n=0; i<a.length; i++) {
		for(let j=i+1; j<a.length; j++)
			for(let k=j+1; k<a.length; k++)
				for(let l=k+1; l<a.length; l++)
					for(let m=l+1; m<a.length; m++)
						for(let n=m+1; n<a.length; n++)
							for(let o=n+1; o<a.length; o++)
								for(let p=o+1; p<a.length; p++)
									for(let q=p+1; q<a.length; q++)
										for(let r=q+1; r<a.length; r++)
											for(let s=r+1; s<a.length; s++)
												for(let t=s+1, b; t<a.length; t++) {
													b = a[i] +
													a[j] +
													a[k] +
													a[l] +
													a[m] +
													a[n] +
													a[o] +
													a[p] +
													a[q] +
													a[r] +
													a[s] +
													a[t];
													if(b > rtn) {
														rtn = b;
													}
												}
	}
	return rtn;
}
