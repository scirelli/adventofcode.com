var input = `rect 1x1
rotate row y=0 by 5
rect 1x1
rotate row y=0 by 6
rect 1x1
rotate row y=0 by 5
rect 1x1
rotate row y=0 by 2
rect 1x1
rotate row y=0 by 5
rect 2x1
rotate row y=0 by 2
rect 1x1
rotate row y=0 by 4
rect 1x1
rotate row y=0 by 3
rect 2x1
rotate row y=0 by 7
rect 3x1
rotate row y=0 by 3
rect 1x1
rotate row y=0 by 3
rect 1x2
rotate row y=1 by 13
rotate column x=0 by 1
rect 2x1
rotate row y=0 by 5
rotate column x=0 by 1
rect 3x1
rotate row y=0 by 18
rotate column x=13 by 1
rotate column x=7 by 2
rotate column x=2 by 3
rotate column x=0 by 1
rect 17x1
rotate row y=3 by 13
rotate row y=1 by 37
rotate row y=0 by 11
rotate column x=7 by 1
rotate column x=6 by 1
rotate column x=4 by 1
rotate column x=0 by 1
rect 10x1
rotate row y=2 by 37
rotate column x=19 by 2
rotate column x=9 by 2
rotate row y=3 by 5
rotate row y=2 by 1
rotate row y=1 by 4
rotate row y=0 by 4
rect 1x4
rotate column x=25 by 3
rotate row y=3 by 5
rotate row y=2 by 2
rotate row y=1 by 1
rotate row y=0 by 1
rect 1x5
rotate row y=2 by 10
rotate column x=39 by 1
rotate column x=35 by 1
rotate column x=29 by 1
rotate column x=19 by 1
rotate column x=7 by 2
rotate row y=4 by 22
rotate row y=3 by 5
rotate row y=1 by 21
rotate row y=0 by 10
rotate column x=2 by 2
rotate column x=0 by 2
rect 4x2
rotate column x=46 by 2
rotate column x=44 by 2
rotate column x=42 by 1
rotate column x=41 by 1
rotate column x=40 by 2
rotate column x=38 by 2
rotate column x=37 by 3
rotate column x=35 by 1
rotate column x=33 by 2
rotate column x=32 by 1
rotate column x=31 by 2
rotate column x=30 by 1
rotate column x=28 by 1
rotate column x=27 by 3
rotate column x=26 by 1
rotate column x=23 by 2
rotate column x=22 by 1
rotate column x=21 by 1
rotate column x=20 by 1
rotate column x=19 by 1
rotate column x=18 by 2
rotate column x=16 by 2
rotate column x=15 by 1
rotate column x=13 by 1
rotate column x=12 by 1
rotate column x=11 by 1
rotate column x=10 by 1
rotate column x=7 by 1
rotate column x=6 by 1
rotate column x=5 by 1
rotate column x=3 by 2
rotate column x=2 by 1
rotate column x=1 by 1
rotate column x=0 by 1
rect 49x1
rotate row y=2 by 34
rotate column x=44 by 1
rotate column x=40 by 2
rotate column x=39 by 1
rotate column x=35 by 4
rotate column x=34 by 1
rotate column x=30 by 4
rotate column x=29 by 1
rotate column x=24 by 1
rotate column x=15 by 4
rotate column x=14 by 1
rotate column x=13 by 3
rotate column x=10 by 4
rotate column x=9 by 1
rotate column x=5 by 4
rotate column x=4 by 3
rotate row y=5 by 20
rotate row y=4 by 20
rotate row y=3 by 48
rotate row y=2 by 20
rotate row y=1 by 41
rotate column x=47 by 5
rotate column x=46 by 5
rotate column x=45 by 4
rotate column x=43 by 5
rotate column x=41 by 5
rotate column x=33 by 1
rotate column x=32 by 3
rotate column x=23 by 5
rotate column x=22 by 1
rotate column x=21 by 2
rotate column x=18 by 2
rotate column x=17 by 3
rotate column x=16 by 2
rotate column x=13 by 5
rotate column x=12 by 5
rotate column x=11 by 5
rotate column x=3 by 5
rotate column x=2 by 5
rotate column x=1 by 5`,
    exampleInput = `rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 1`;

function parseInstructions(input, board){
    input = input.map(function(line){
        line = line.split(' ');
        if(line[0].indexOf('rect') > -1){
            line = line.concat(line.pop().split('x'));
            board.rect(parseInt(line[1]), parseInt(line[2]));
        }else {//a rotation
            if(line[1].indexOf('column') > -1){
                line[2] = line[2].replace('x=','');
                board.rotateColumn(parseInt(line[2]), parseInt(line[4]));
            }else{
                 line[2] = line[2].replace('y=','');
                board.rotateRow(parseInt(line[2]), parseInt(line[4]));
            }
        }
        console.log(board.toString());
        return line;
    });
    return input;
}

function Board(width, height){
    this.width = width || 0;
    this.height = height || 0;
    this.board = new Array(width*height);

    this.board.fill('.');
}

Board.prototype = {
    toString: function(){
        var output = '\n';

        for(var y=0; y<this.height; y++){
            for(var x=0; x<this.width; x++){
                output += this.board[this.xyToPos(x,y)];
            }
            output += '\n';
        }

        return output;
    },


    rotateColumn: function(x, amount){
        var aTmp = [];

        amount = amount%this.height;

        for(var l=this.height, i=l-amount; i<l; i++){
            aTmp.push(this.board[this.xyToPos(x, i)]);
        }
       
        for(var right=this.height-1, left=right-amount,i=0, l=this.height-amount,lItem; i<l; i++){
            lItem = this.board[this.xyToPos(x, left-i)];
            this.board[this.xyToPos(x, right-i)] = lItem;
        }
        
        for(var i=0, l=aTmp.length; i<l; i++){
            this.board[this.xyToPos(x,i)] = aTmp[i];
        }
        return this;
    },

    rotateRow: function(y, amount){
        var aTmp = [];

        amount = amount%this.width;

        for(var l=this.width, i=l-amount; i<l; i++){
            aTmp.push(this.board[this.xyToPos(i, y)]);
        }
       
        for(var right=this.width-1, left=right-amount,i=0, l=this.width-amount,lItem; i<l; i++){
            lItem = this.board[this.xyToPos(left-i,y)];
            this.board[this.xyToPos(right-i,y)] = lItem;
        }

        for(var i=0, l=aTmp.length; i<l; i++){
            this.board[this.xyToPos(i,y)] = aTmp[i];
        }
        return this;
    },

    rect:function(width, height){
        for(var y=0; y<height; y++){
            for(var x=0; x<width; x++){
                this.board[this.xyToPos(x,y)] = '#';
            }
        }

        return this;
    },
    
    //Assuming all input is valid.
    xyToPos:function(x,y){
        return (y*this.width) + x;
    }
}


//var board = new Board(7, 3);
var board = new Board(50, 6);
parseInstructions(input.split('\n'), board);
console.log(board.board.reduce(function(ac, curV){
    if(curV === '#'){
        ac++;
    }
    return ac;
},0));
//console.log(board.toString());
//EFEYKFRFIJ
