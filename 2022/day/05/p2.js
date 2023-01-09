#!/usr/bin/env node
/*
--- Day 5: Supply Stacks ---
--- Part Two ---
As you watch the crane operator expertly rearrange the crates, you notice the process isn't following your prediction.

Some mud was covering the writing on the side of the crane, and you quickly wipe it away. The crane isn't a CrateMover 9000 - it's a CrateMover 9001.

The CrateMover 9001 is notable for many new and exciting features: air conditioning, leather seats, an extra cup holder, and the ability to pick up and move multiple crates at once.

Again considering the example above, the crates begin in the same configuration:

    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 
Moving a single crate from stack 2 to stack 1 behaves the same as before:

[D]        
[N] [C]    
[Z] [M] [P]
 1   2   3 
However, the action of moving three crates from stack 1 to stack 3 means that those three moved crates stay in the same order, resulting in this new configuration:

        [D]
        [N]
    [C] [Z]
    [M] [P]
 1   2   3
Next, as both crates are moved from stack 2 to stack 1, they retain their order as well:

        [D]
        [N]
[C]     [Z]
[M]     [P]
 1   2   3
Finally, a single crate is still moved from stack 1 to stack 2, but now it's crate C that gets moved:

        [D]
        [N]
        [Z]
[M] [C] [P]
 1   2   3
In this example, the CrateMover 9001 has put the crates in a totally different order: MCD.

Before the rearrangement process finishes, update your simulation so that the Elves know where they should stand to be ready to unload the final supplies. After the rearrangement procedure completes, what crate ends up on top of each stack?
*/
const readline = require('node:readline');
const { stdin: input} = require('node:process');

const rl = readline.createInterface({input});
let result = 0,
    lines = [];

rl.on('line', (function() {
    return (input) => {
        console.log(`Received: ${input}`);
        lines.push(input);
    };
})());

rl.on('close', ()=>{
    console.log(parseFile(lines));
});

function parseFile(lines) {
    let grid = parseStacks(parseGridHeight(lines), lines);

    console.debug(grid);
    for(let i=findFirstMoveLine(lines); i<lines.length; i++){
        performMove(grid, parseMove(lines[i]));
    }
    console.debug(grid);
    return grid.reduce((a,crt)=>{
        if(crt[crt.length-1]){
            a += crt[crt.length-1];
        }
        return a;
    }, '');
}

function parseStacks(height, lines) {
    let grid = new Array(9).fill(0).map(x=>[]);

    for(let i=height-1; i>=0; i--){
        parseLine(lines[i]).forEach((c,i)=>{
            if(c) grid[i].push(c);
        });
    }

    return grid;

    function parseLine(input) {
        return tokenize(input).map(parseToken);

        function parseToken(t) {
            let c = null;
            for(let l of t){
                if(l.charCodeAt(0) >= 'A'.charCodeAt(0) && l.charCodeAt(0) <= 'Z'.charCodeAt(0)){
                    c = l;
                }
            }
            return c;
        }

        function tokenize(input) {
            let tokens = [];
            for(let i=0,c=null,token=[]; i<input.length; i++){
                c = input[i];
                token.push(c);
                if(token.length === 3){
                    tokens.push(token);
                    token = [];
                    i++;
                }
            }
            return tokens;
        }
    }
}

function parseGridHeight(lines){
    for(let i=0; i<lines.length; i++){
        if(lines[i][1] === '1'){
            return i;
        }
    }
    return 0;
}

function findFirstMoveLine(lines) {
    for(let i=0; i<lines.length; i++){
        if(isMove(lines[i])) return i;
    }
    return 0;
}

function isMove(input) {
    return input.startsWith('move');
}

function isBoxLine(input) {
    return input.includes('[');
}

function isStackCount(input){
    return input[1] === '1';
}

function performMove(grid, move) {
    console.debug(`crates:${move[0]} from:${move[1]} to:${move[2]}`);
    let crateCount = move[0],
        fromStack = move[1]-1,
        toStack = move[2]-1,
        t = [];

    for(let i=0; i<crateCount; i++){
        t.push(grid[fromStack].pop());
    }
    
    for(let i=0; i<crateCount; i++){
        grid[toStack].push(t.pop());
    }

    return grid;
}

function parseMove(line) {
    return line.split(' ').map(Number).filter(n=>!isNaN(n));
}
