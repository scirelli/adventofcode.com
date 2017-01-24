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
        
        var startNodeName = this.board.charAt(this.startPoint),
            nodeCount = Object.getOwnPropertyNames(this.shortestPaths).length;
        this.findShortestPathBetweenAllControllRooms(startNodeName, [startNodeName], nodeCount);
        console.log('Solution: ' + this.shortestPathLength);
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
        var stack = [{loc:startPoint, pathLength:0, roomsToVisit:suroundingRooms.call(this,startPoint)}],
            endPointType = this.getBoard().charAt(endPoint),
            visitedDic = {},
            distance = Number.MAX_SAFE_INTEGER,
            currentRoom, roomType, roomToVisit;

        visitedDic[startPoint] = true;    
        while(stack.length){ 
            currentRoom = stack[stack.length-1];
            roomType = this.getBoard().charAt(currentRoom.loc);
            
            if(roomType === endPointType){
                if(currentRoom.pathLength < distance){
                    distance = currentRoom.pathLength;
                }
                stack.pop();
                continue;
            }

            roomToVisit = currentRoom.roomsToVisit.pop();
            if(!roomToVisit) {
                stack.pop();
            }else if(isValidMove.call(this, roomToVisit)){
                stack.push({loc:roomToVisit, pathLength:currentRoom.pathLength+1, roomsToVisit:suroundingRooms.call(this, roomToVisit, currentRoom.loc)});
            }
        }

        return distance;

        function suroundingRooms(room, comeFrom){
            var list = [], t;
            comeFrom = comeFrom || new Point(-1, -1);

            t = this.moveLeft(room);
            if(!(t.x === comeFrom.x && t.y === comeFrom.y)) {
                list.push(t);
            }
            t = this.moveRight(room);
            if(!(t.x === comeFrom.x && t.y === comeFrom.y)) {
                list.push(t);
            }
            t = this.moveUp(room);
            if(!(t.x === comeFrom.x && t.y === comeFrom.y)) {
                list.push(t);
            }
            t = this.moveDown(room);
            if(!(t.x === comeFrom.x && t.y === comeFrom.y)) {
                list.push(t);
            }
            return list;
        }
        function isValidMove(point){
            return !this.getBoard().charAt(point) || this.getBoard().charAt(point) === Board.roomTypes.WALL ? false : true;
        }
    },
    findShortestPathDistancesBetweenAllControllRooms:function(){
        this.shortestPaths = {};

        for(var i=0, l=this.allControllRooms.length, cr; i<l; i++){
            cr = this.allControllRooms[i];
            this.shortestPaths[cr.name] = {};

            for(var j=i+1, jl=this.allControllRooms.length, nr; j<jl; j++){
                nr = this.allControllRooms[j];
                this.shortestPaths[cr.name][nr.name] = this.findShortestPathDistanceBetweenTwoPoints(cr.loc, nr.loc);
            }
        }
        for(var i=0, a=Object.getOwnPropertyNames(this.shortestPaths), l=a.length,io, x,y; i<l; i++){
            io = this.shortestPaths[a[i]];
            for(var j=0, ja=Object.getOwnPropertyNames(io), jl=ja.length; j<jl; j++){
                x = a[i];
                y = ja[j];
                this.shortestPaths[y][x] = this.shortestPaths[x][y];
            }
        }
    },
    findShortestPathBetweenAllControllRooms:function(nodeName, path, nodeCount) {
        var childNodes = Object.getOwnPropertyNames(this.shortestPaths[nodeName]),
            nextChild;

        while((nextChild = childNodes.pop())){
            if(path.indexOf(nextChild) === -1){
                path.push(nextChild);
                this.findShortestPathBetweenAllControllRooms(nextChild, path, nodeCount);
                path.pop();
            }
        }
        if(path.length === nodeCount){
            var self = this,
                dist = path.reduce((ac, itm, index)=>{
                    var d = self.shortestPaths[itm][path[index+1]];
                    
                    if(d !== undefined){
                        return ac+d;
                    }else{
                        return ac;    
                    }
                }, 0);

            if(dist < this.shortestPathLength){
                this.shortestPathLength = dist;
                console.log('[' + path.join(',') + '] = ' + dist);
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
