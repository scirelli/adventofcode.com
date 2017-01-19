var process = require('process');

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin
    .on('data', processData)
    .on('end', startGame);

var boardStr = '';
function processData(data){
    boardStr += data;
}

function startGame(){
    var game = new Game();
    game.setBoard(boardStr);
    console.log('Start locatoin: ' + game.getStartLocation());
    console.log(game.getBoard().toString());
    game.play();
}

//=========================== Game ==============================
function Game(){
    this.board = new Board();
    this.startPoint = new Point();
    this.shortestPaths = {};
    this.shortestPathLength = Number.MAX_SAFE_INTEGER;
    this.allControllRooms = [];
}

Game.prototype = {
    play:function(){
        this.findAllControllRooms();
        this.findStartPonit();
        this.findShortestPathDistancesBetweenAllControllRooms();
        console.log(JSON.stringify(this.shortestPaths, null, 4));
        process.exit(0);
    },
    findAllControllRooms:function(){
        var controllRooms = [];
        
        for(var y=0, height=this.getBoard().getHeight(); y<height; y++){
            for(var x=0, width=this.getBoard().getWidth(),c; x<width; x++){
                c = this.getBoard().charAt(x, y);
                if(!isNaN(parseInt(c))){
                    controllRooms.push({loc:new Point(x, y), name:c});
                }
            }
        }
        
        this.allControllRooms = controllRooms;
        return controllRooms;
    },
    findShortestPathDistanceBetweenTwoPoints:function(startPoint, endPoint){
        var q = [{loc:startPoint, pathLength:0}],
            endPointType = this.getBoard().charAt(endPoint),
            visitedDic = {},
            foundDic = {},
            distance = Number.MAX_SAFE_INTEGER,
            currentRoom, roomType, leftRoom, rightRoom, upRoom, downRoom;

        visitedDic[startPoint] = true;    
        while(q.length){ 
            currentRoom = q[q.length-1];
            roomType = this.getBoard().charAt(currentRoom.loc);
            leftRoom = this.moveLeft(currentRoom.loc);
            rightRoom = this.moveRight(currentRoom.loc);
            upRoom = this.moveUp(currentRoom.loc);
            downRoom = this.moveDown(currentRoom.loc);

            if(roomType === endPointType){
                if(currentRoom.pathLength < distance){
                    distance = currentRoom.pathLength;
                    q.pop();
                }
            }else if(!visitedDic[leftRoom] && isValidMove.call(this, leftRoom)){
                q.push({loc:leftRoom, pathLength:currentRoom.pathLength+1});
                visitedDic[leftRoom] = true;
            }else if(!visitedDic[upRoom] && isValidMove.call(this, upRoom)){
                q.push({loc:upRoom, pathLength:currentRoom.pathLength+1});
                visitedDic[upRoom] = true;
            }else if(!visitedDic[rightRoom] && isValidMove.call(this, rightRoom)){
                q.push({loc:rightRoom, pathLength:currentRoom.pathLength+1});
                visitedDic[rightRoom] = true;
            }else if(!visitedDic[downRoom] && isValidMove.call(this, downRoom)){
                q.push({loc:downRoom, pathLength:currentRoom.pathLength+1});
                visitedDic[downRoom] = true;
            }else{
                q.pop();
            }
        }

        return distance;

        function isValidMove(point){
            return !this.getBoard().charAt(point) || this.getBoard().charAt(point) === Board.roomTypes.WALL ? false : true;
        }
    },
    findShortestPathDistancesBetweenAllControllRooms:function(){
        this.shortestPaths = {};

        for(var i=0, l=this.allControllRooms.length-1, cr; i<l; i++){
            cr = this.allControllRooms[i];
            this.shortestPaths[cr.name] = {};

            for(var j=i+1, jl=this.allControllRooms.length, nr; j<jl; j++){
                nr = this.allControllRooms[j];
                this.shortestPaths[cr.name][nr.name] = this.findShortestPathDistanceBetweenTwoPoints(cr.loc, nr.loc);
            }
        }
    },
    setBoard:function(board){
        if(typeof(board) === 'string'){
            this.board = new Board(board);
        }else if(board instanceof Board){
            this.board = board;
        }else{
            this.board = new Board();
        }

        return this;
    },
    getBoard:function(){
        return this.board;
    },
    findStartPonit:function(){
        for(var i=0, a=this.allControllRooms, l=a.length; i<l; i++){
            if(a[i].name === '0'){
                this.startPoint = a[i].loc;
                return this.startPoint;
            }
        }

        throw new Error('Could not find starting point.');
    },
    getStartLocation:function(){
        return this.startPoint;
    },
    moveUp:function(p){
        p = p.clone();
        p.y--;
        return p;
    },
    moveRight:function(p){
        p = p.clone();
        p.x++;
        return p;
    },
    moveDown:function(p){
        p = p.clone();
        p.y++;
        return p;
    },
    moveLeft:function(p){
        p = p.clone();
        p.x--;
        return p;
    }
};

//=========================== Board =============================
function Board(boardStr){
    this.boardStr = '';
    this.width = 0;
    this.height = 0;
    this.startPoint = new Point();
    this.init(boardStr);
}

Board.prototype = {
    init:function(boardStr){
        this.setBoard(boardStr);
        this.width = getBoardWidth(this.boardStr);
        this.height = getBoardHeight(this.boardStr);

        function getBoardWidth(boardStr){
            var width = 0,
                c = boardStr.charAt(width);

            while(c !== '\n' && width < boardStr.length){
                c = boardStr.charAt(++width);
            }
            return width+1;
        }
        function getBoardHeight(boardStr, width){
            width = width || getBoardWidth(boardStr);
            return Math.floor(boardStr.length/width);
        }

        return this;
    },
    setBoard:function(board){
        if(typeof(board) === 'string'){
            this.boardStr = board;
        }else{
            this.boardStr = '';
        }

        return this;
    },
    xyToPos:function(x, y){
        if(typeof x === 'object' && x.x !== undefined && x.y !== undefined){
            y = x.y;
            x = x.x;
        }

        if(x<this.width && x >= 0 && y < this.height && y >= 0){
            return this.width*y + x;
        }
        throw new Error('Out of bounds. x= \'' + x + '\' y=\'' + y + '\'');
    },
    charAt:function(x, y){
        if(typeof x === 'object' && x.x !== undefined && x.y !== undefined){
            y = x.y;
            x = x.x;
        }

        return this.boardStr.charAt(this.xyToPos(x, y));
    },
    toString:function(){
        return `Width: ${this.width}
Height: ${this.height}
${this.boardStr}`;
    },
    getWidth:function(){
        return this.width;
    },
    getHeight:function(){
        return this.height;
    }
};
Board.roomTypes = Object.defineProperties({}, {
    WALL: {
        value: '#',
        writeable:false
    },
    EMPTY_ROOM: {
        value: '.',
        writeable:false
    },
    END_OF_LINE:{
        value: '\n',
        writeable:false
    }
});

//=========================== Point =============================
function Point(x, y){
    this.x = x || 0;
    this.y = y || 0;
    
    if(typeof x === 'object' && x.x !== undefined && x.y !== undefined){
        this.copy(x);
    }
}

Point.prototype = {
    copy:function(p){
        if(p.x !== undefined && p.y !== undefined){
            this.x = p.x;
            this.y = p.y;
        }

        return this;
    },
    clone:function(){
        return new Point(this);
    },
    toString:function(){
        return `(${this.x}, ${this.y})`;
    }
};

//=========================== ControlRoom =======================
function ControlRoom(name, loc, distance){
    this.name = name || '';
    this.distance = distance || 0;
    this.location = loc || new Point();
}
