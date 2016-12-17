'use strict';

var input = 1364,
    exampleInput = 10,
    favNumber = input,
    computeSquare = (x,y)=>{
        var v = new Number((x*x) + (3*x) + (2*x*y) + y + (y*y) + favNumber);
        return v.toString(2).split('').map(Number).reduce((ac,v)=>{
            return ac+v;
        },0) % 2;
    },
    destX = 31,
    destY = 39;

shortestPath(destX, destY, destX*2, destY*2);

function shortestPath(destX, destY, boardMaxX, boardMaxY){
    var cube = {x:1, y:1, d:0},
        q = [cube],
        visited = {};
     
    //printBoard(boardMaxX, boardMaxY, destX, destY);
    while(cube = q.shift()){
        if(cube.x===destX && cube.y===destY) {
            console.log(cube.d);
            continue;
        }
        if(cube.x < 0 || cube.y<0) continue;
        if(visited[cube.x + ',' + cube.y]) continue;

        visited[cube.x + ',' + cube.y] = true;

        if(computeSquare(cube.x+1,cube.y) === 0){
            q.push({x:cube.x+1, y:cube.y, d:cube.d+1});
        }
        if(computeSquare(cube.x-1,cube.y) === 0){
            q.push({x:cube.x-1, y:cube.y, d:cube.d+1});
        }
        if(computeSquare(cube.x,cube.y+1) === 0){
            q.push({x:cube.x, y:cube.y+1, d:cube.d+1});
        }
        if(computeSquare(cube.x,cube.y-1) === 0){
            q.push({x:cube.x, y:cube.y-1, d:cube.d+1});
        }
    }
    console.log(Object.getOwnPropertyNames(visited).length);
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

