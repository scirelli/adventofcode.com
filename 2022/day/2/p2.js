#!/usr/bin/env node
/*
--- Part Two ---
The Elf finishes helping with the tent and sneaks back over to you. "Anyway, the second column says how the round needs to end: X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win. Good luck!"

The total score is still calculated in the same way, but now you need to figure out what shape to choose so the round ends as indicated. The example above now goes like this:

In the first round, your opponent will choose Rock (A), and you need the round to end in a draw (Y), so you also choose Rock. This gives you a score of 1 + 3 = 4.
In the second round, your opponent will choose Paper (B), and you choose Rock so you lose (X) with a score of 1 + 0 = 1.
In the third round, you will defeat your opponent's Scissors with Rock for a score of 1 + 6 = 7.
Now that you're correctly decrypting the ultra top secret strategy guide, you would get a total score of 12.

Following the Elf's instructions for the second column, what would your total score be if everything goes exactly according to your strategy guide?
*/
process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';

process.stdin.on('data', inputStdin => {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.replace(/\s*$/, '')
        .split('\n')
        .map(str => str.replace(/\s*$/, ''))
        .map(str => str.split(' '));

    console.log(main(inputString));
});

function main(input) {
    //lose, draw, win
    const WIN = 6,
        LOSE = 0,
        DRAW = 3;
    const shapesValue = {
        //rock
            A: 0,
            //paper
            B: 1,
            //scissors
            C: 2,
            //Lose
            X: -1,
            //Draw
            Y: 0,
            //Win
            Z: 1
        },
        // Rock, Paper, Scissors
        // 1,       2,      3
        s = [1, 2, 3];
    //    0     1       2
    //  Rock, Paper, Scissors
    // X = LOSE = RR
    // Y = DRAW = Stay
    // Z = WIN = RL
    return input.reduce((a, r)=>{
        a += scoreRound(shapesValue[r[0]], myDraw(...r));
        return a;
    }, 0);

    function scoreRound(opp, me) {
        let result = s[me] - s[opp],
            score = null;

        if(result === -2 || result === 1) { //win
            score = WIN;
        }else if(result === 0) {            //Draw
            score = DRAW;
        }else {                             //Loss
            score = LOSE;
        }

        score += s[me];
        return score;
    }

    function myDraw(opp, goal) {
        //           index           Direction = s index
        return mod((shapesValue[opp] + shapesValue[goal]), 3);
    }

    function mod(n, m) {
        return ((n % m) + m) % m;
    }
}
