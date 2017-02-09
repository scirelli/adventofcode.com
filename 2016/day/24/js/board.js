if(window.game === undefined) window.game = {};

window.game.Board = (function(Point) {
    'use strict';
    
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

    return Board;
})(game.Point);
