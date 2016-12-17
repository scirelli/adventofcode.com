'use strict';

var input = 1364,
    exampleInput = 10,
    favNumber = input,
    computeSquare = (x,y)=>{
        var v = new Number(x*x + 3*x + 2*x*y + y + y*y + favNumber);
        return v.toString(2).split('').map(Number).reduce((ac,v)=>{
            return ac+v;
        },0) % 2;
    },
    destX = 31,
    destY = 39;

console.log(shortestPath(destX, destY, destX*2, destY*2));

function shortestPath(destX, destY, boardMaxX, boardMaxY){
    var count = 0,
        visited = {};
    
    travers(1, 1, 0);
    //printBoard(boardMaxX, boardMaxY, destX, destY);
    function travers(x, y, curDist) {
        if(curDist >= 50) {
            visited[x + ',' + y] = true;
            return;
        }
        if(visited[x + ',' + y]){
            return;
        }
        if(x>boardMaxX || y>boardMaxY || x<0 || y<0) {
            return;
        }
        if(computeSquare(x,y) !== 0){
            return;
        }

        visited[x + ',' + y] = true;
        travers(x+1,y, curDist+1);
        travers(x, y+1, curDist+1);
        travers(x-1,y, curDist+1);
        travers(x, y-1, curDist+1);
    }

    return Object.getOwnPropertyNames(visited).length;
}

function printBoard(mX, mY, gX, gY){
    var board = [];

    for(let y=0; y<mY; y++){
        board.push([]);
        for(let x=0; x<mX; x++){
            if(x === gX && y === gY){
                board[y].push('O');
            }else{
                board[y].push(computeSquare(x,y) === 0 ? '.' : '#');
            }
        }
    }
    console.log(board.map((v)=>{return v.join(',')}).join('\n'));
}
