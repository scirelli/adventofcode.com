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
    console.log(game.getBoard().toString());
    game.play();
}

//=========================== Game ==============================
function Game(){
    this.board = new Board();
    this.allControllRooms = [];
    this.distances = {};
}

Game.prototype = {
    play:function(){
        this.findAllControllRooms();
        this.findDistanceBetweenEachControlRoom();
        process.exit(0);
    },

    findAllControllRooms:function(){
        var controllRooms = [];
        
        for(var y=0, height=this.getBoard().getHeight(); y<height; y++){
            for(var x=0, width=this.getBoard().getWidth(),c,n; x<width; x++){
                c = this.getBoard().charAt(x, y);
                if(!isNaN(parseInt(c))){
                    n = new Node(new Point(x, y));
                    n.name = c;
                    controllRooms.push(n);
                }
            }
        }
        
        this.allControllRooms = controllRooms;
        return controllRooms;
    },
    findDistanceBetweenEachControlRoom:function() {
        for(var i=0, a=this.allControllRooms, l=a.length; i<l; i++){
            this.distances[a[i].name] = this.findShortestPathFromRoomToAllTheRest(a[i]);
            this.distances[a[i].name][a[i].name] = 0;
            console.log(a[i].name);
            console.log(this.distances[a[i].name]);
        }
    },
    findShortestPathFromRoomToAllTheRest:function(startNode){
        var visited = {},
            self = this,
            distances = {},
            board = this.getBoard(),
            head = startNode,
            tail = head;

        while(head){
            if(isControlRoom(head)){
                if(!distances[nodeType(head)] || head.pathLength < distances[nodeType(head)]){
                    distances[nodeType(head)] = head.pathLength;
                }
            }else{
                visit(head);
            }
            
            tail = addRoomsNode(board, head, tail, visited, visit);
            advanceHead();
        }
        
        return distances;

        function addRoomsNode(board, currentNode, tail, visitedDic, visit){
            var room = currentNode.loc, t;

            t = moveLeft(room);
            if(isValidMove(board, t, visitedDic)) {
                tail.next = new Node(t, currentNode.pathLength+1);
                visit(tail.next);
                tail = tail.next;
            }
            t = moveRight(room);
            if(isValidMove(board, t, visitedDic)) {
                tail.next = new Node(t, currentNode.pathLength+1);
                visit(tail.next);
                tail = tail.next;
            }
            t = moveUp(room);
            if(isValidMove(board, t, visitedDic)) {
                tail.next = new Node(t, currentNode.pathLength+1);
                visit(tail.next);
                tail = tail.next;
            }
            t = moveDown(room);
            if(isValidMove(board, t, visitedDic)) {
                tail.next = new Node(t, currentNode.pathLength+1);
                visit(tail.next);
                tail = tail.next;
            }

            return tail;
        }

        function advanceHead() {
            var node = head;
            head = head.next;
            return node;
        }

        function visit(node) {
            if(visited[node.loc]) {
                visited[node.loc]++;
            }else{
                visited[node.loc] = 1;
            }
        }

        function nodeType(node) {
            return board.charAt(node.loc);
        }

        function isControlRoom(node){
            return !isNaN(nodeType(node));
        }

        function isValidMove(board, point, visitedDic){
            try{
                return board.charAt(point) && board.charAt(point) !== Board.roomTypes.WALL && !visitedDic[point];
            }catch(e){
                console.error(e);
            }

            return false;
        }

        function moveUp(p){
            p = p.clone();
            p.y--;
            return p;
        }

        function moveRight(p){
            p = p.clone();
            p.x++;
            return p;
        }

        function moveDown(p){
            p = p.clone();
            p.y++;
            return p;
        }

        function moveLeft(p){
            p = p.clone();
            p.x--;
            return p;
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

//=========================== Node =============================
function Node(loc, distance){
    this.loc = loc || new Point();
    this.pathLength = distance || 0;
    this.next = null;
    this.name = '';
    this.toString = function(){
        return this.loc;
    };
}

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
