#!/usr/bin/env node
/*
--- Day 13: Distress Signal ---
--- Part Two ---

Now, you just need to put all of the packets in the right order. Disregard the blank lines in your list of received packets.

The distress signal protocol also requires that you include two additional divider packets:

[[2]]
[[6]]

Using the same rules as before, organize all packets - the ones in your list of received packets as well as the two divider packets - into the correct order.

For the example above, the result of putting the packets in the correct order is:

[]
[[]]
[[[]]]
[1,1,3,1,1]
[1,1,5,1,1]
[[1],[2,3,4]]
[1,[2,[3,[4,[5,6,0]]]],8,9]
[1,[2,[3,[4,[5,6,7]]]],8,9]
[[1],4]
[[2]]
[3]
[[4,4],4,4]
[[4,4],4,4,4]
[[6]]
[7,7,7]
[7,7,7,7]
[[8,7,6]]
[9]

Afterward, locate the divider packets. To find the decoder key for this distress signal, you need to determine the indices of the two divider packets and multiply them together. (The first packet is at index 1, the second packet is at index 2, and so on.) In this example, the divider packets are 10th and 14th, and so the decoder key is 140.

Organize all of the packets into the correct order. What is the decoder key for the distress signal?
*/
const readline = require('node:readline');
const {stdin: input} = require('node:process');

const rl = readline.createInterface({input});
const packetPairs = [],
    marker1 = [[2]],
    marker2 = [[6]];

rl.on('line', (function() {
    let p = {};
    return line => {
        try{
            let v = JSON.parse(line);
            if(!p.left){
                p.left = v;
            }else if(!p.right){
                p.right = v;
                packetPairs.push(p);
                p = {};
            }
        }catch(e){}
    };
})());

rl.on('close', ()=>{
    let result = evaluateMessages(packetPairs);
    console.log(JSON.stringify(result.map(v=>v.n), '\n', '\t'));
    console.log(
        result.reduce((a,v,i)=>{
            if(v.o === marker1 || v.o === marker2){
                a *= i+1;
            }
            return a;
        }, 1)
    );
});

function evaluateMessages(packetPairs) {
    return packetPairs.reduce((a, pair, index)=> {
        if(correctOrder(pair.left, pair.right) < 0){
            a.push(pair.left);
            a.push(pair.right);
        }else{
            a.push(pair.right);
            a.push(pair.left);
        }
        return a;
    }, [marker1, marker2]).map(v=>{
        return {n:v.flat(1000).join(','), o:v};
    }).sort((a,b)=>{
        if(a.n<b.n) return -1;
        if(a.n===b.n) return 0;
        if(a.n>b.n) return 1;
    });
}

function correctOrder(left, right) {
    if(isNumber(left) && isNumber(right)){
        return left - right;
    }

    if(Array.isArray(left) && Array.isArray(right)) {
        let i=0,l,r,v;
        for(i=0; i<left.length; i++) {
            l=left[i];
            r=right[i];
            if(r === undefined) return 1;
            v = correctOrder(l,r);
            if(v === 0) continue;
            return v;
        }
        return i-right.length;
    }

    if(isNumber(left)) {
        return correctOrder([left], right);
    }

    if(isNumber(right)) {
        return correctOrder(left, [right]);
    }

    return null;
}
/*
    > If both values are integers:
        * The lower integer should come first.
          - If the left integer is lower than the right integer, the inputs are in the right order.
        * If the left integer is higher than the right integer, the inputs are not in the right order.
        * Otherwise, the inputs are the same integer; continue checking the next part of the input.

    > If both values are lists:
        * Compare the first value of each list, then the second value, and so on.
            - If the left list runs out of items first, the inputs are in the right order.
            - If the right list runs out of items first, the inputs are not in the right order.
            - If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.

    > If exactly one value is an integer:
        * Convert the integer to a list which contains that integer as its only value, then retry the comparison.
          For example, if comparing [0,0,0] and 2, convert the right value to [2] (a list containing 2);
          the result is then found by instead comparing [0,0,0] and [2].
*/

function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}
