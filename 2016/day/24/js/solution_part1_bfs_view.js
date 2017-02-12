if(window.game === undefined) window.game = {};

window.game.AI = (function() {
    'use strict';
    
    const BAD   = 0,
          GOOD  = 1,
          FOUND = 2,
          END   = 3,
          PATH_TO_LONG = 4;

    var Board = game.Board,
        Point = game.Point;

    function Game(board){
        this.board = new Board();
        this.startPoint = new Point();
        this.shortestPaths = {};
        this.shortestPathLength = Number.MAX_SAFE_INTEGER;
        this.allControllRooms = [];
        this.allControllRoomsByName = {};

        if(board) {
            this.setBoard(board);
        }
    }

    Game.prototype = {
        init:function(){
            findAllControllRooms.call(this);
            findStartPonit.call(this);
        },
        findShortestPathDistanceBetweenTwoPoints:function(startPoint, endPoint){
            var visitedDic = {},
                stack = [new Node(startPoint, 0)],
                endPointType = this.getBoard().charAt(endPoint),
                distance = Number.MAX_SAFE_INTEGER,
                currentRoom, roomType, roomToVisit,
                index = 0,
                self = this;

            return function tick() {
                currentRoom = stack.pop();

                if(!currentRoom){
                    throw new Error('Empty stack');
                }

                roomType = self.getBoard().charAt(currentRoom.loc);

                if(roomType === endPointType){
                    if(currentRoom.pathLength < distance){
                        distance = currentRoom.pathLength;
                    }
                    currentRoom.status = FOUND;
                }else if(currentRoom.pathLength >= distance){
                    currentRoom.status = PATH_TO_LONG;
                    visitedDic[currentRoom.loc] = true; 
                }else{
                    currentRoom.status = GOOD;
                    addSuroundingRooms(self.getBoard(), stack, currentRoom, visitedDic);
                    visitedDic[currentRoom.loc] = true; 
                }
                
                return currentRoom;
            }
        },
        findShortestPathDistancesBetweenAllControllRooms:function(startPoint){
            var visited = {},
                self = this,
                distances = {},
                board = this.getBoard(),
                head = new Node(startPoint),
                tail = head;

            return function tick(){
                if(!head) throw new Error('Empty queue.');
                
                if(isControlRoom(head)){
                    if(!distances[nodeType(head)] || head.pathLength < distances[nodeType(head)]){
                        distances[nodeType(head)] = head.pathLength;
                    }
                    head.status = FOUND;
                    head.type = nodeType(head);
                }else{
                    visit(head);
                }
                
                tail = addRoomsNode(board, head, tail, visited, visit);
                return advanceHead();
            };

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
        getAllControlRooms:function(){
            return this.allControllRooms;
        },
        getAllControlRoomsByName:function(){
            return this.allControllRoomsByName;
        }
    };

    function findAllControllRooms(){
        var controllRooms = [];
        
        for(var y=0, height=this.getBoard().getHeight(); y<height; y++){
            for(var x=0, width=this.getBoard().getWidth(),c,room; x<width; x++){
                c = this.getBoard().charAt(x, y);
                if(!isNaN(parseInt(c))){
                    room = {loc:new Point(x, y), name:c};
                    controllRooms.push(room);
                    this.allControllRoomsByName[c] = room; 
                }
            }
        }
        
        this.allControllRooms = controllRooms;
        return controllRooms;
    }

    function findStartPonit(){
        for(var i=0, a=this.allControllRooms, l=a.length; i<l; i++){
            if(a[i].name === '0'){
                this.startPoint = a[i].loc;
                return this.startPoint;
            }
        }

        throw new Error('Could not find starting point.');
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

    function addSuroundingRooms(board, stack, currentRoom, visitedDic){
        var room = currentRoom.loc, t;

        t = moveLeft(room);
        if(isValidMove(board, t, visitedDic)) {
            stack.push(new Node(t, currentRoom.pathLength+1));
        }
        t = moveRight(room);
        if(isValidMove(board, t, visitedDic)) {
            stack.push(new Node(t, currentRoom.pathLength+1));
        }
        t = moveUp(room);
        if(isValidMove(board, t, visitedDic)) {
            stack.push(new Node(t, currentRoom.pathLength+1));
        }
        t = moveDown(room);
        if(isValidMove(board, t, visitedDic)) {
            stack.push(new Node(t, currentRoom.pathLength+1));
        }

        return stack;
    }

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

    function isValidMove(board, point, visitedDic){
        try{
            return board.charAt(point) && board.charAt(point) !== game.Board.roomTypes.WALL && !visitedDic[point];
        }catch(e){
            console.error(e);
        }

        return false;
    }

    function Node(loc, distance){
        this.loc = loc || new Point();
        this.pathLength = distance || 0;
        this.next = null;
        this.status = GOOD;
        this.toString = function(){
            return this.loc;
        };
    }

    return {
        BAD:BAD,
        GOOD:GOOD,
        FOUND:FOUND,
        END:END,
        PATH_TO_LONG:PATH_TO_LONG,
        Game:Game
    };
})();
