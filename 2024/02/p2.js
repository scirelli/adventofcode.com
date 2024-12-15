#!/usr/bin/env node
/*
--- Part Two ---

The engineers are surprised by the low number of safe reports until they realize they forgot to tell you about the Problem Dampener.

The Problem Dampener is a reactor-mounted module that lets the reactor safety systems tolerate a single bad level in what would otherwise be a safe report. It's like the bad level never happened!

Now, the same rules apply as before, except if removing a single level from an unsafe report would make it safe, the report instead counts as safe.

More of the above example's reports are now safe:

    7 6 4 2 1: Safe without removing any level.
    1 2 7 8 9: Unsafe regardless of which level is removed.
    9 7 6 2 1: Unsafe regardless of which level is removed.
    1 3 2 4 5: Safe by removing the second level, 3.
    8 6 4 4 1: Safe by removing the third level, 4.
    1 3 6 7 9: Safe without removing any level.

Thanks to the Problem Dampener, 4 reports are actually safe!

Update your analysis by handling situations where the Problem Dampener can remove a single level from unsafe reports. How many reports are now safe?
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');

const rl = readline.createInterface({input});
let validReports = 0;

function validReport(report) {
	for(let i=0,d=report[i] - report[i+1]; i<report.length-1; i++) {
		//The levels are either all increasing or all decreasing.
		if(d < 0 && (report[i] - report[i+1]) > 0) return i;
		if(d > 0 && (report[i] - report[i+1]) < 0) return i;

		d = report[i] - report[i+1];

		//Any two adjacent levels differ by at least one and at most three.
		if(Math.abs(d) === 0 || Math.abs(d) > 3) {
			return i;
		}
	}
	return -1;
}

rl.on('line', (function() {
    return line => {
			let report = line.split(' ').map(Number),
				i=validReport(report);

			if( i === -1){
				validReports++;
				//console.log(report.join(' '));
			} else {
				let r = report.slice(0),
					r2 = report.slice(0),
					r3 = report.slice(0);

				r3.splice(i-1,1);//first element in the array could be wrong
				r.splice(i,1);
			  r2.splice(i+1,1);

				if(validReport(r3) === -1){
					validReports++;
				} else if(validReport(r) === -1){
					validReports++;
				}else if(validReport(r2) === -1){
					validReports++;
				}
			}
		};
})());

rl.on('close', ()=>{
	console.log(validReports);
});
