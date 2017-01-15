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
    this.foundPoints = {};
}

Game.prototype = {
    play:function(){
        var fromStartToAllOther, roomName,
            allControllerRooms = {},
            self = this;
        
        fromStartToAllOther = this.findDistanceToAllControlRoomsFromAPoint(this.startPoint);
        roomName = this.getBoard().charAt(this.startPoint);
        delete fromStartToAllOther[roomName];
        allControllerRooms[this.startPoint] = fromStartToAllOther;

        Object.getOwnPropertyNames(fromStartToAllOther).forEach(function(prop){
            var o = fromStartToAllOther[prop],
                startPoint = o.location,
                roomName;

            o = self.findDistanceToAllControlRoomsFromAPoint(startPoint);
            roomName = self.getBoard().charAt(startPoint);
            delete o[roomName];
            allControllerRooms[startPoint] = o;
        });

        console.log(JSON.stringify(allControllerRooms, null, 4));
    },
    findDistanceToAllControlRoomsFromAPoint:function(point){
        var q = [{loc:point, pathLength:0}],
            visitedDic = {},
            foundDic = {},
            currentRoom,
            roomType;
            
        while((currentRoom = q.pop())){ 
            roomType = this.getBoard().charAt(currentRoom.loc);

            if(visitedDic[currentRoom.loc]){
                continue;
            }else if(roomType === Board.roomTypes.EMPTY_ROOM){
                visitAllAdjacentRooms.call(this, currentRoom, q);
                visitedDic[currentRoom.loc] = true;
            }else if(!isNaN(roomType)){
                if(!foundDic[roomType]){
                    foundDic[roomType] = new ControlRoom(roomType, currentRoom.loc.clone(), currentRoom.pathLength);
                    visitAllAdjacentRooms.call(this, currentRoom, q);
                }else{
                    if(currentRoom.pathLength < foundDic[roomType].pathLength){
                        foundDic[roomType].pathLength = currentRoom.pathLength;
                    }
                }
            }
        }

        return foundDic;

        function visitAllAdjacentRooms(currentRoom, q){
            q.push({loc:this.moveUp(currentRoom.loc), pathLength:currentRoom.pathLength+1});
            q.push({loc:this.moveDown(currentRoom.loc), pathLength:currentRoom.pathLength+1});
            q.push({loc:this.moveLeft(currentRoom.loc), pathLength:currentRoom.pathLength+1});
            q.push({loc:this.moveRight(currentRoom.loc), pathLength:currentRoom.pathLength+1});
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

        this.startPoint = this.findStartPonit();
        return this;
    },
    getBoard:function(){
        return this.board;
    },
    findStartPonit:function(){
        for(var y=0, height=this.getBoard().getHeight(); y<height; y++){
            for(var x=0, width=this.getBoard().getWidth(),c; x<width; x++){
                c = this.getBoard().charAt(x, y);
                if(c === '0'){
                    return new Point(x, y);
                }
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
