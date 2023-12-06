#!/usr/bin/env node
/*
--- Day 1: Trebuchet?! ---
--- Part Two ---
Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

Equipped with this new information, you now need to find the real first and last digit on each line. For example:

two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.

What is the sum of all of the calibration values?


*/
const readline = require('node:readline');
const { stdin } = require('node:process');

const rl = readline.createInterface({
    input:    stdin,
    terminal: false
});

const digits = {
        zero:  0, //4
        one:   1, //3
        two:   2, //3
        three: 3, //5
        four:  4, //4
        five:  5, //4
        six:   6, //3
        seven: 7, //5
        eight: 8, //5
        nine:  9  //4
    },
    stigid = {
        orez:  0, //4
        eno:   1, //3
        owt:   2, //3
        eerht: 3, //5
        ruof:  4, //4
        evif:  5, //4
        xis:   6, //3
        neves: 7, //5
        thgie: 8, //5
        enin:  9  //4
    };

let total = 0;

rl.on('line', line => {
    total += forward(line) * 10 + backward(line);
});

rl.on('close', ()=>{
    console.error(total);
});

function forward(line) {
    let zeroCode = '0'.charCodeAt(0),
        result = null;

    for(let i=0, l=line.length, ss=null, c, d; i<l; i++) {
        if(i+2 < l) {
            ss = line.substring(i, i+3);
            if(ss in digits) {
                result = digits[ss];
                i+=2;
                break;
            }
        }
        if(i+3 < l) {
            ss = line.substring(i, i+4);
            if(ss in digits) {
                result = digits[ss];
                i+=3;
                break;
            }
        }
        if(i+4 < l) {
            ss = line.substring(i, i+5);
            if(ss in digits) {
                result = digits[ss];
                i+=4;
                break;
            }
        }
        c = line[i].charCodeAt(0);
        d = c - zeroCode;
        if(d >= 0 && d <= 9) {
            result = d;
            break;
        }
    }
    return result;
}

function backward(line) {
    let zeroCode = '0'.charCodeAt(0),
        result = null;

    line = line.split('').reverse().join('');
    for(let i=0, l=line.length, ss=null, c, d; i<l; i++) {
        if(i+2 < l) {
            ss = line.substring(i, i+3);
            if(ss in stigid) {
                result = stigid[ss];
                i+=2;
                break;
            }
        }
        if(i+3 < l) {
            ss = line.substring(i, i+4);
            if(ss in stigid) {
                result = stigid[ss];
                i+=3;
                break;
            }
        }
        if(i+4 < l) {
            ss = line.substring(i, i+5);
            if(ss in stigid) {
                result = stigid[ss];
                i+=4;
                break;
            }
        }
        c = line[i].charCodeAt(0);
        d = c - zeroCode;
        if(d >= 0 && d <= 9) {
            result = d;
            break;
        }
    }
    return result;
}
