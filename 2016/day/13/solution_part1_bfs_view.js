window.gameAI = (function() {
    'use strict';
    
    const BAD = 0,
        GOOD = 1,
        FOUND = 2;

    var input = 1364,
        exampleInput = 10,
        favNumber = input,
        computeSquare = (x,y)=>{
            var v = new Number((x*x) + (3*x) + (2*x*y) + y + (y*y) + favNumber);
            return v.toString(2).split('').map(Number).reduce((ac,v)=>{
                return ac+v;
            },0) % 2;
        },
        startPoint = new Point(1,1,1),
        goalPoint = new Point(31,39,0);

    return {
        BAD:BAD,
        GOOD:GOOD,
        FOUND:FOUND,
        Point:Point,
        printBoard:printBoard,
        shortestPath:function() {
            return shortestPath(goalPoint, goalPoint.x*2, goalPoint.y*2);
        },
        computeSquare:computeSquare,
        goalPoint:goalPoint,
        startPoint:startPoint
    };

    function shortestPath(goalPoint, boardMaxX, boardMaxY){
        var cube = startPoint,
            q = [cube],
            visited = {};
        
        return function tick(){ 
            cube = q.shift();

            if(cube.x===goalPoint.x && cube.y===goalPoint.y) {
                console.log(cube.d);
                return new Result(cube, FOUND);
            }
            if(cube.x < 0 || cube.y<0){
                return new Result(cube, BAD);
            }
            if(visited[cube.x + ',' + cube.y]){
                return new Result(cube, BAD);
            }

            visited[cube.x + ',' + cube.y] = true;

            if(computeSquare(cube.x+1,cube.y) === 0){
                q.push(new Point(cube.x+1, cube.y, cube.d+1));
            }
            if(computeSquare(cube.x-1,cube.y) === 0){
                q.push(new Point(cube.x-1, cube.y, cube.d+1));
            }
            if(computeSquare(cube.x,cube.y+1) === 0){
                q.push(new Point(cube.x, cube.y+1, cube.d+1));
            }
            if(computeSquare(cube.x,cube.y-1) === 0){
                q.push(new Point(cube.x, cube.y-1, cube.d+1));
            }

            return new Result(cube, GOOD);
        }
    }

    function Point(x, y, d) {
        this.x = x;
        this.y = y;
        this.d = d;
    }

    function Result(point, stat) {
        this.point = point;
        this.status = stat;
        this.toString = function() {
            var stat = this.status
            switch(stat) {
            case GOOD:
                stat = 'GOOD';
                break;
            case BAD:
                stat = 'BAD';
                break;
            case FOUND:
                stat = 'FOUND';
                break;
            }
            return `(${this.point.x}, ${this.point.y}): ${stat}`;
        }
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
