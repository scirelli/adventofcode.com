(function() {
    'use strict';

    var input = 1364,
        favNumber = input,
        computeSquare = (x,y)=>{
            var v = new Number((x*x) + (3*x) + (2*x*y) + y + (y*y) + favNumber);
            return v.toString(2).split('').map(Number).reduce((ac,v)=>{
                return ac+v;
            },0) % 2;
        };

    shortestPath();

    function shortestPath(){
        var cube = {x:1, y:1, d:0},
            q = [cube],
            visited = {},
            count = 0;
         
        while(cube = q.shift()){
            if(cube.x < 0 || cube.y<0) continue;
            if(visited[cube.x + ',' + cube.y]) continue;
            if(cube.d >= 50) {
                count++;
                continue;
            }

            visited[cube.x + ',' + cube.y] = true;
            count++;

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
        console.log(count);
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
})();
