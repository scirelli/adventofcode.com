#!/usr/bin/env node
/*
--- Day 6: Tuning Trouble ---
--- Part Two ---
Your device's communication system is correctly detecting packets, but still isn't working. It looks like it also needs to look for messages.

A start-of-message marker is just like a start-of-packet marker, except it consists of 14 distinct characters rather than 4.

Here are the first positions of start-of-message markers for all of the above examples:

mjqjpqmgbljsphdztnvjfqwrcgsmlb: first marker after character 19
bvwbjplbgvbhsrlpgdmjqwftvncz: first marker after character 23
nppdvjthqldpwncqszvftbrmjlhg: first marker after character 23
nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg: first marker after character 29
zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw: first marker after character 26
How many characters need to be processed before the first start-of-message marker is detected?
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');

const rl = readline.createInterface({input});
let lines = [];

rl.on('line', (function() {
    return (input) => {
        console.log(`Received: ${input}`);
        lines.push(input);
    };
})());

rl.on('close', ()=>{
    lines.map(line=>{
        console.log(startOfPacketMarker(line)+ 1);
    });
});

function startOfPacketMarker(line) {
    for(let s=13; s<line.length; s++) {
        if(dupes(line.substring(s-13, s+1))) continue;
        return s;
    }
}

function dupes(str) {
    str = str.split('').sort().join('');
    for(let i=1; i<str.length; i++) {
        if(str[i] === str[i-1]) {
            return true;
        }
    }
    return false;
}
