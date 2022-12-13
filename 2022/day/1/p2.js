#!/usr/bin/env node
/*
--- Part Two ---
By the time you calculate the answer to the Elves' question, they've already realized that the Elf carrying the most Calories of food might eventually run out of snacks.

To avoid this unacceptable situation, the Elves would instead like to know the total Calories carried by the top three Elves carrying the most Calories. That way, even if one of those Elves runs out of snacks, they still have two backups.

In the example above, the top three Elves are the fourth Elf (with 24000 Calories), then the third Elf (with 11000 Calories), then the fifth Elf (with 10000 Calories). The sum of the Calories carried by these three elves is 45000.

Find the top three Elves carrying the most Calories. How many Calories are those Elves carrying in total?
*/
process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', inputStdin => {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.replace(/\s*$/, '')
        .split('\n')
        .map(str => str.replace(/\s*$/, ''))
        .map(str => {
            str = parseInt(str);
            if(isNaN(str)) str = null;
            return str;
        });

    console.log(main(inputString));
});

function readLine() {
    return inputString[currentLine++];
}

function main(inputString) {
    console.log(inputString);
    let curSum = 0,
        a = inputString.reduce((a, v)=> {
            if(v === null){
                if(curSum > a[0]){
                    a[2] = a[1]
                    a[1] = a[0];
                    a[0] = curSum;
                }else if(curSum > a[1]){
                    a[2] = a[1];
                    a[1] = curSum;
                }else if(curSum > a[2]) {
                    a[2] = curSum;
                }
                curSum = 0;
            }else{
                curSum += v;
            }
            return a;
        }, [0,0,0]);

        if(curSum > a[0]){
            a[2] = a[1]
            a[1] = a[0];
            a[0] = curSum;
        }else if(curSum > a[1]){
            a[2] = a[1];
            a[1] = curSum;
        }else if(curSum > a[2]) {
            a[2] = curSum;
        }
    return a[0] + a[1] + a[2];
}
